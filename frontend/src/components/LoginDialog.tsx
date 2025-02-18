// クライアントコンポーネント
'use client';

import { signIn } from 'next-auth/react';
import Dialog from './Dialog';

// props の型定義
interface LoginDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

/**
 * ログインを促すDialogを表示するコンポーネント
 * @component LoginDialog
 * @return {JSX.Element} LoginDialogを表示するReactコンポーネント
 */
const LoginDialog = ({ isOpen, setIsOpen }: LoginDialogProps) => {
  return (
    <Dialog
      isOpen={isOpen}
      title='ログインが必要です'
      description='この機能を利用するには，ログインする必要があります．'
      yesCallback={() => {
        setIsOpen(false);
        signIn();
      }}
      noCallback={() => {
        setIsOpen(false);
      }}
      yesText='ログイン'
      noText='今はしない'
    />
  );
};

export default LoginDialog;
