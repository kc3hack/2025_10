// クライアントコンポーネント
'use client';

import { CiUser, CiSettings, CiLogout, CiLogin, CiClock2 } from 'react-icons/ci';
import { PiRankingLight } from 'react-icons/pi';
import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Dialog from './Dialog';
import LoginDialog from './LoginDialog';
import { useRouter } from 'next/navigation';

// props の型定義
interface SideMenuProps {
  className?: string;
  style?: React.CSSProperties;
}

enum PATHNAME {
  HOME = '/',
  PROFILE = '/profile',
  RANKING = '/ranking',
  SETTINGS = '/settings',
}

/**
 * サイドメニューを表示するコンポーネント
 * @component SideMenu
 * @param {SideMenuProps} props - ユーザデータを含むオブジェクト
 * @return {JSX.Element} サイドメニューを表示するReactコンポーネント
 */
const SideMenu = ({ className, style }: SideMenuProps) => {
  // セッションの取得
  const session = useSession();
  // ログイン状態
  const isLoggedIn = session.status === 'authenticated';
  // ログアウト確認ダイアログの開閉状態
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  // ログイン促進ダイアログの開閉状態
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className={`${className} z-10 w-40 space-y-3 `} style={style}>
      <div
        onClick={() => {
          router.push('/');
        }}
        className={`flex items-center rounded-lg bg-transparent hover:cursor-pointer hover:bg-black/5 ${
          pathname === PATHNAME.HOME ? 'bg-orange-200' : ''
        }`}
      >
        <CiClock2 size={28} />
        <a className={`pl-1 text-xl ${pathname === PATHNAME.HOME ? 'font-bold' : ''}`}>
          タイムライン
        </a>
      </div>
      {isLoggedIn && (
        <div
          onClick={() => {
            router.push('/profile');
          }}
          className={`flex items-center rounded-lg bg-transparent hover:cursor-pointer hover:bg-black/5 ${
            pathname === PATHNAME.PROFILE ? 'bg-orange-200' : ''
          }`}
        >
          <CiUser size={28} />
          <a className={`pl-1 text-xl ${pathname === PATHNAME.PROFILE ? 'font-bold' : ''}`}>
            プロフィール
          </a>
        </div>
      )}
      <div
        onClick={() => {
          if (isLoggedIn) {
            router.push('/ranking');
          } else {
          }
        }}
        className={`flex items-center rounded-lg bg-transparent hover:cursor-pointer hover:bg-black/5 ${
          pathname === PATHNAME.RANKING ? 'bg-orange-200' : ''
        }`}
      >
        <PiRankingLight size={28} />
        <a className={`pl-1 text-xl ${pathname === PATHNAME.RANKING ? 'font-bold' : ''}`}>
          雅ランキング
        </a>
      </div>
      <div
        onClick={() => {
          if (isLoggedIn) {
            router.push('/settings');
          } else {
            setLoginDialogOpen(true);
          }
        }}
        className={`flex items-center rounded-lg bg-transparent hover:cursor-pointer hover:bg-black/5 ${
          pathname === PATHNAME.SETTINGS ? 'bg-orange-200' : ''
        }`}
      >
        <CiSettings size={28} />
        <a className={`pl-1 text-xl ${pathname === PATHNAME.SETTINGS ? 'font-bold' : ''}`}>設定</a>
      </div>
      {!isLoggedIn && (
        <div
          onClick={() => signIn()}
          className='flex items-center rounded-lg bg-transparent hover:cursor-pointer hover:bg-black/5'
        >
          <CiLogin size={28} />
          <a className='pl-1 text-xl'>ログイン</a>
        </div>
      )}
      {isLoggedIn && (
        <div
          onClick={() => setLogoutDialogOpen(true)}
          className='flex items-center rounded-lg bg-transparent hover:cursor-pointer hover:bg-black/5'
        >
          <CiLogout size={28} />
          <a className='pl-1 text-xl'>ログアウト</a>
        </div>
      )}
      {isLoggedIn && (
        <div className='flex items-center'>
          <Image
            src={session.data?.user?.image ?? '/iconDefault.png'}
            height={28}
            width={28}
            alt='Icon'
            className='rounded-full'
          />
          <a className='pl-1 text-xl'>{session.data?.user?.name ?? 'Name'}</a>
        </div>
      )}
      {/* ログアウト確認ダイアログ表示が有効の場合，ダイアログを表示する */}
      <Dialog
        isOpen={logoutDialogOpen}
        title='ログアウト'
        description='ログアウトしますか？'
        yesCallback={() => {
          setLogoutDialogOpen(false);
          signOut();
        }}
        noCallback={() => {
          setLogoutDialogOpen(false);
        }}
        yesText='はい'
        noText='いいえ'
      />
      {/* ログイン確認ダイアログ表示が有効の場合，ダイアログを表示する */}
      <LoginDialog isOpen={loginDialogOpen} setIsOpen={setLoginDialogOpen} />
    </div>
  );
};

export default SideMenu;
