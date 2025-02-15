// クライアントコンポーネント
'use client';

import React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { PostTypes } from '@/types/postTypes';
import { TankaTypes } from '@/types/tankaTypes';
import ImageModal from '@/components/ImageModal';
import { formatDateKanji } from '@/app/timeline/utils/kanjiNumber';

// props の型定義
type PostProps = {
  post: PostTypes;
  className?: string;
};

/**
 * 単一の投稿を表示するコンポーネント
 * @component Post
 * @param {PostProps} props - 投稿データを含むオブジェクト
 * @return {JSX.Element} 投稿を表示するReactコンポーネント
 */
export default function Post({ post, className }: PostProps) {
  // 短歌をパースする
  const tanka = parseTanka(post.tanka);
  // 投稿に画像が含まれるか
  const hasImage = Boolean(post.imageUrl);
  // 画像の拡大表示状態
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className={`${className} border-b border-gray-500 p-4`}>
      {/* プロフィールアイコン */}
      <div className='flex mb-3 items-center'>
        <Image
          src={post.user.iconUrl !== '' ? post.user.iconUrl : '/iconDefault.png'}
          height={40}
          width={40}
          alt='Icon'
          className='rounded-full cursor-pointer hover:brightness-75'
        />
        <div className='ml-2 items-center cursor-pointer'>
          <p className='text-lg hover:underline text-black'>{post.user.name}</p>
        </div>
      </div>
      {/* アイコン以外 */}
      <div
        className={`flex justify-center items-start relative w-full aspect-[4/3] overflow-hidden mx-auto ${
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
          className={`object-cover rounded-xl ${hasImage ? 'filter brightness-50' : ''}`}
        />
        <div className='absolute top-1/2 transform -translate-y-1/2 flex justify-center items-start'>
          <p
            className={`self-end font-shinryu ${
              hasImage ? 'text-white' : 'text-black'
            } text-base mr-3 [writing-mode:vertical-rl] [text-orientation:upright]`}
          >
            {post.user.name}
          </p>
          <p
            className={`inline-block align-top font-shinryu ${
              hasImage ? 'text-white' : 'text-black'
            } text-3xl whitespace-pre-line [writing-mode:vertical-rl] [text-orientation:upright]`}
          >
            {tanka}
          </p>
        </div>
      </div>
      <p className='w-full mt-3 whitespace-pre-line break-words text-black'>{post.original}</p>
      <div className='flex mt-3 items-center text-black'>
        {formatDateKanji(post.date)}
        <div className='ml-auto flex items-center'>
          <p className='text-sm mr-2'>{post.miyabi.toLocaleString()}</p>
        </div>
      </div>
      {/* 拡大表示が有効の場合，モーダルを表示する */}
      {modalOpen && <ImageModal imageUrl={post.imageUrl} setModalOpen={setModalOpen} />}
    </div>
  );
}

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
