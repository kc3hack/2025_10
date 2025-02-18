// クライアントコンポーネント
'use client';

import React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { PostTypes } from '@/types/postTypes';
import ImageModal from '@/components/ImageModal';
import MiyabiButton from '@/components/MiyabiButton';
import DropDownButton from './DropDownButton';
import { formatDateKanji } from '@/app/timeline/utils/kanjiNumber';
import { MdDeleteForever } from 'react-icons/md';
import { useSession } from 'next-auth/react';
import Dialog from '@/components/Dialog';
import LoginDialog from './LoginDialog';
import { addMiyabi, removeMiyabi } from '@/app/timeline/actions/countMiyabi';
import deletePost from '@/app/timeline/actions/deletePost';

// props の型定義
interface PostProps {
  post: PostTypes;
  className?: string;
  onDelete: (postId: string) => void;
}

/**
 * 単一の投稿を表示するコンポーネント
 * @component Post
 * @param {PostProps} props - 投稿データを含むオブジェクト
 * @return {JSX.Element} 投稿を表示するReactコンポーネント
 */
const Post = ({ post, className, onDelete }: PostProps) => {
  // 短歌をパースする
  const tanka = parseTanka(post.tanka);
  // 投稿に画像が含まれるか
  const hasImage = Boolean(post.imageUrl);
  // 雅カウントの状態
  const [miyabiCount, setMiyabiCount] = useState(post.miyabiCount);
  // 画像の拡大表示状態
  const [modalOpen, setModalOpen] = useState(false);
  // 削除確認ダイアログの表示状態
  const [dialogOpen, setDialogOpen] = useState(false);
  // 削除失敗ダイアログの表示状態
  const [deleteFailedDialogOpen, setDeleteFailedDialogOpen] = useState(false);
  // ユーザアイコンURLが一致するなら自分の投稿
  const isMyPost = useSession().data?.user?.image === post.user.iconUrl;
  // ドロップダウンメニューの要素
  const dropDownItems = [];
  // ドロップダウンメニューの投稿削除ボタン
  const dropDownDeleteButton = {
    label: '投稿を削除',
    onClick: () => setDialogOpen(true),
    className: '',
    icon: <MdDeleteForever />,
    color: 'red',
  };
  // 自分の投稿ならドロップダウンに削除ボタン追加
  if (isMyPost) {
    dropDownItems.push(dropDownDeleteButton);
  }
  // セッションの取得
  const session = useSession();
  // ログイン状態
  const isLoggedIn = session.status === 'authenticated';
  // ログイン促進ダイアログの開閉状態
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  // 親の持つPostsから自身を削除する
  const handleDelete = () => {
    onDelete(post.id);
  };

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
        <DropDownButton className='ml-auto flex' items={dropDownItems}></DropDownButton>
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
          <p className='mr-2 text-sm'>{miyabiCount.toLocaleString()}</p>
          <MiyabiButton
            size='small'
            onClick={async () => {
              if (isLoggedIn) {
                setMiyabiCount((count) => ++count);
                await addMiyabi({ postId: post.id, iconUrl: session.data?.user?.image ?? '' });
              } else {
                setLoginDialogOpen(true);
              }
            }}
            onCancel={async () => {
              if (isLoggedIn) {
                setMiyabiCount((count) => --count);
                await removeMiyabi({ postId: post.id, iconUrl: session.data?.user?.image ?? '' });
              } else {
                setLoginDialogOpen(true);
              }
            }}
            initialIsClicked={post.miyabiIsClicked}
            className='mr-0'
          />
        </div>
      </div>
      {/* 拡大表示が有効の場合，モーダルを表示する */}
      {modalOpen && <ImageModal imageUrl={post.imageUrl} setModalOpen={setModalOpen} />}
      {/* 削除確認ダイアログ表示が有効の場合，ダイアログを表示する */}
      <Dialog
        isOpen={dialogOpen}
        title='投稿の削除'
        description='この投稿を削除しますか？'
        yesCallback={async () => {
          console.log('はい');
          setDialogOpen(false);
          const result = await deletePost({
            postId: post.id,
            iconUrl: session.data?.user?.image ?? '',
          });
          if (!result) setDeleteFailedDialogOpen(true);
          else handleDelete();
        }}
        noCallback={() => {
          console.log('いいえ');
          setDialogOpen(false);
        }}
        yesText='はい'
        noText='いいえ'
      />
      {/* 削除失敗ダイアログ表示が有効の場合，ダイアログを表示する */}
      <Dialog
        isOpen={deleteFailedDialogOpen}
        title='エラー'
        description='投稿の削除に失敗しました。時間をおいてやり直してみてください。'
        yesCallback={() => {
          setDeleteFailedDialogOpen(false);
        }}
        yesText='はい'
        isOnlyOK
      />
      {/* ログイン確認ダイアログ表示が有効の場合，ダイアログを表示する */}
      <LoginDialog isOpen={loginDialogOpen} setIsOpen={setLoginDialogOpen} />
    </div>
  );
};

/**
 * 短歌をパースして，改行と全角空白を追加する．
 * @function parseTanka
 * @param {Array<string>} tanka - 短歌の配列
 * @return {string} パースされた短歌の文字列
 */
const parseTanka = (tanka: Array<string>): string => {
  const parsedTanka: string = `${tanka[0]}\n\u3000${tanka[1]}\n\u3000\u3000${tanka[2]}\n${tanka[3]}\n\u3000${tanka[4]}`;
  return parsedTanka;
};

export default Post;
