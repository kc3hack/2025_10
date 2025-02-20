'use client';

import React from 'react';
import { useState } from 'react';
import FloatingActionButton from '@/components/FloatingActionButton';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import LoginDialog from '@/components/LoginDialog';
import { useRouter } from 'next/navigation';
import Timeline from '@/components/Timeline';
import HeaderAndMenu from '@/components/HeaderAndMenu';

const LIMIT = 10; // 一度に取得する投稿数
const MAX = 100; // タイムラインに表示できる最大投稿数

const Page = () => {
  // セッションの取得
  const session = useSession();
  // ログイン状態
  const isLoggedIn = session.status === 'authenticated';
  // ログイン促進ダイアログの開閉状態
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const router = useRouter();

  return (
    <div className='relative min-h-screen'>
      <HeaderAndMenu />
      {/* 背景画像 */}
      <div className='fixed left-0 top-0 z-[-1] h-lvh w-full opacity-20'>
        <Image src='/bg.jpg' fill alt='Background' className='object-cover'></Image>
      </div>

      {/* タイムライン */}
      <div className='mx-auto max-w-lg'>
        <Timeline limit={LIMIT} max={MAX} />
      </div>

      {/* 投稿（詠）ボタン */}
      <FloatingActionButton
        char='詠'
        onClick={() => {
          if (isLoggedIn) {
            router.push('/yomu');
          } else {
            setLoginDialogOpen(true);
          }
        }}
      />

      {/* ログイン確認ダイアログ表示が有効の場合，ダイアログを表示する */}
      <LoginDialog isOpen={loginDialogOpen} setIsOpen={setLoginDialogOpen} />
    </div>
  );
};

export default Page;
