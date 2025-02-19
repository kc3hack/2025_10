'use client';

import React from 'react';
import { useState } from 'react';
import FloatingActionButton from '@/components/FloatingActionButton';
import { MdOutlineMenu } from 'react-icons/md';
import SideMenu from '@/components/SideMenu';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import LoginDialog from '@/components/LoginDialog';
import { useRouter } from 'next/navigation';
import Timeline from '@/components/Timeline';

const LIMIT = 10; // 一度に取得する投稿数
const MAX = 100; // タイムラインに表示できる最大投稿数

const Page = () => {
  // ハンバーガーメニューの開閉状態
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // セッションの取得
  const session = useSession();
  // ログイン状態
  const isLoggedIn = session.status === 'authenticated';
  // ログイン促進ダイアログの開閉状態
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const router = useRouter();

  return (
    <div className='relative min-h-screen'>
      {/* ヘッダ */}
      <div className='fixed top-0 z-40 flex h-12 w-full items-center justify-center bg-white font-kokuryu text-2xl'>
        <MdOutlineMenu
          onClick={() => {
            setIsMenuOpen(true);
            console.log('open');
          }}
          className='absolute left-3 lg:hidden'
        />
        <div className=''>Tankalizer</div>
      </div>

      {/* 背景画像 */}
      <div className='fixed left-0 top-0 z-[-1] h-screen w-full opacity-20'>
        <Image src='/bg.jpg' layout='fill' objectFit='cover' alt='Background'></Image>
      </div>

      {/* タイムライン */}
      <div className='pt-12'>
        <div className='mx-auto max-w-lg'>
          <SideMenu className='fixed top-16 hidden -translate-x-full lg:block' />
          <Timeline limit={LIMIT} max={MAX} />
        </div>
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

      {/* ハンバーガーメニュー */}
      {isMenuOpen && (
        <div className='fixed inset-0 z-50 justify-center lg:hidden'>
          <div className='flex h-fit w-full bg-white py-4'>
            <SideMenu className='mx-auto' />
          </div>
          <div onClick={() => setIsMenuOpen(false)} className='size-full bg-black/50'></div>
        </div>
      )}

      {/* ログイン確認ダイアログ表示が有効の場合，ダイアログを表示する */}
      <LoginDialog isOpen={loginDialogOpen} setIsOpen={setLoginDialogOpen} />
    </div>
  );
};

export default Page;
