// クライアントコンポーネント
'use client';

import React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { PostTypes } from '@/types/postTypes';
import { TankaTypes } from '@/types/tankaTypes';
import ImageModal from '@/components/ImageModal';
import MiyabiButton from '@/components/MiyabiButton';
import DropDownButton from './DropDownButton';
import { formatDateKanji } from '@/app/timeline/utils/kanjiNumber';
import { MdDeleteForever } from 'react-icons/md';
import Dialog from './Dialog';

// props の型定義
interface PostProps {
  post: PostTypes;
  className?: string;
}

/**
 * 単一の投稿を表示するコンポーネント
 * @component Post
 * @param {PostProps} props - 投稿データを含むオブジェクト
 * @return {JSX.Element} 投稿を表示するReactコンポーネント
 */
const Post = ({ post, className }: PostProps) => {
  // 短歌をパースする
  const tanka = parseTanka(post.tanka);
  // 投稿に画像が含まれるか
  const hasImage = Boolean(post.imageUrl);
  // 画像の拡大表示状態
  const [modalOpen, setModalOpen] = useState(false);
  // 削除確認ダイアログの表示状態
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className={`${className} border-b border-gray-500 p-4`}>
      {/* プロフィールアイコン */}
      <div className='mb-3 flex items-center'>
        <Image
          src={post.user.iconUrl !== '' ? post.user.iconUrl : '/iconDefault.png'}
          height={40}
          width={40}
          alt='Icon'
          className='cursor-pointer rounded-full hover:brightness-75'
        />
        <div className='ml-2 cursor-pointer items-center'>
          <p className='text-lg text-black hover:underline'>{post.user.name}</p>
        </div>
        <DropDownButton
          className='ml-auto flex'
          items={[
            {
              label: '投稿を削除',
              onClick: () => setDialogOpen(true),
              className: '',
              icon: <MdDeleteForever />,
              color: 'red',
            },
          ]}
        ></DropDownButton>
      </div>
      {/* アイコン以外 */}
      <div
        className={`relative mx-auto flex aspect-[4/3] w-full items-start justify-center overflow-hidden ${
          hasImage ? 'cursor-pointer' : ''
        }`}
        // 画像をクリックすると拡大表示を有効化
        onClick={() => {
          if (hasImage) setModalOpen(true);
        }}
      >
        <Image
          src={post.imageUrl !== '' ? post.imageUrl : '/imageDefault.png'}
          fill
          alt='Image'
          className={`rounded-xl object-cover ${hasImage ? 'brightness-50' : ''}`}
        />
        <div className='absolute top-1/2 flex -translate-y-1/2 items-start justify-center'>
          <p
            className={`self-end font-shinryu ${
              hasImage ? 'text-white' : 'text-black'
            } mr-3 text-base [text-orientation:upright] [writing-mode:vertical-rl] lg:text-lg`}
          >
            {post.user.name}
          </p>
          <p
            className={`inline-block align-top font-shinryu ${
              hasImage ? 'text-white' : 'text-black'
            } whitespace-pre-line text-2xl [text-orientation:upright] [writing-mode:vertical-rl] lg:text-3xl`}
          >
            {tanka}
          </p>
        </div>
      </div>
      <p className='mt-3 w-full whitespace-pre-line break-words text-black'>{post.original}</p>
      <div className='mt-3 flex items-center text-black'>
        {formatDateKanji(post.date)}
        <div className='ml-auto flex items-center'>
          <p className='mr-2 text-sm'>{post.miyabi.toLocaleString()}</p>
          <MiyabiButton size='small' className='mr-0' />
        </div>
      </div>
      {/* 拡大表示が有効の場合，モーダルを表示する */}
      {modalOpen && <ImageModal imageUrl={post.imageUrl} setModalOpen={setModalOpen} />}
      {/* ダイアログ表示が有効の場合，ダイアログを表示する */}
      {dialogOpen && (
        <Dialog
          isOpen={dialogOpen}
          title='投稿の削除'
          description='この投稿を削除しますか？'
          yesCallback={() => {
            console.log('はい');
            setDialogOpen(false);
          }}
          noCallback={() => {
            console.log('いいえ');
            setDialogOpen(false);
          }}
          yesText='はい'
          noText='いいえ'
        />
      )}
    </div>
  );
};

/**
 * 短歌をパースして，改行と全角空白を追加する．
 * @function parseTanka
 * @param {TankaTypes} tanka - 短歌型オブジェクト
 * @return {string} パースされた短歌の文字列
 */
const parseTanka = (tanka: TankaTypes): string => {
  const parsedTanka: string = `${tanka.line1}\n\u3000${tanka.line2}\n\u3000\u3000${tanka.line3}\n${tanka.line4}\n\u3000${tanka.line5}`;
  return parsedTanka;
};

export default Post;
