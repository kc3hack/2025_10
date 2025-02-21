'use client';

import React from 'react';
import { useState } from 'react';
import FloatingActionButton from '@/components/FloatingActionButton';
import { useSession } from 'next-auth/react';
import LoginDialog from '@/components/LoginDialog';
import { useRouter } from 'next/navigation';
import Timeline from '@/components/Timeline';

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
      {/* タイムライン */}
      <div className='mx-auto max-w-sm lg:max-w-lg'>
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
