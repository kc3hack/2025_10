// クライアントコンポーネント
'use client';

import { CiUser, CiSettings, CiLogout, CiLogin } from 'react-icons/ci';
import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import Dialog from './Dialog';
import LoginDialog from './LoginDialog';

// props の型定義
interface SideMenuProps {
  className?: string;
  style?: React.CSSProperties;
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

  return (
    <div className={`${className} w-40 space-y-3`} style={style}>
      <div
        onClick={() => {
          if (isLoggedIn) {
          } else {
            setLoginDialogOpen(true);
          }
        }}
        className='flex items-center rounded-lg bg-transparent hover:cursor-pointer hover:bg-black/5'
      >
        <CiUser size={28} />
        <a className='pl-1 text-xl'>プロフィール</a>
      </div>
      <div
        onClick={() => {
          if (isLoggedIn) {
          } else {
            setLoginDialogOpen(true);
          }
        }}
        className='flex items-center rounded-lg bg-transparent hover:cursor-pointer hover:bg-black/5'
      >
        <CiSettings size={28} />
        <a className='pl-1 text-xl'>設定</a>
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
      {logoutDialogOpen && (
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
      )}
      {/* ログイン確認ダイアログ表示が有効の場合，ダイアログを表示する */}
      {loginDialogOpen && <LoginDialog isOpen={loginDialogOpen} setIsOpen={setLoginDialogOpen} />}
    </div>
  );
};

export default SideMenu;
