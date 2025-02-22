// クライアントコンポーネント
'use client';

import { useSession } from 'next-auth/react';
import FloatingActionButton from './FloatingActionButton';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LoginDialog from './LoginDialog';

// props の型定義
interface YomuButtonProps {
  className?: string;
  onClick?: () => void;
}

/**
 * 詠ボタンを表示するコンポーネント
 * @component YomuButton
 * @return {JSX.Element} 詠ボタンを表示するReactコンポーネント
 */
const YomuButton = ({ className, onClick }: YomuButtonProps) => {
  // セッションの取得
  const session = useSession();
  // ログイン状態
  const isLoggedIn = session.status === 'authenticated';
  // ログイン促進ダイアログの開閉状態
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const router = useRouter();

  return (
    <div>
      {/* 投稿（詠）ボタン */}
      <FloatingActionButton
        char='詠'
        onClick={() => {
          if (isLoggedIn) {
            router.push('/yomu');
          } else {
            setLoginDialogOpen(true);
          }
          onClick?.();
        }}
        className={className ? className : ''}
      />

      {/* ログイン確認ダイアログ表示が有効の場合，ダイアログを表示する */}
      <LoginDialog isOpen={loginDialogOpen} setIsOpen={setLoginDialogOpen} />
    </div>
  );
};

export default YomuButton;
