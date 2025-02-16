// クライアントコンポーネント
'use client';

import { CiUser, CiSettings, CiLogout } from 'react-icons/ci';
import Image from 'next/image';
import { UserTypes } from '@/types/userTypes';

// props の型定義
interface SideMenuProps {
  user: UserTypes;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * サイドメニューを表示するコンポーネント
 * @component SideMenu
 * @param {SideMenuProps} props - ユーザデータを含むオブジェクト
 * @return {JSX.Element} サイドメニューを表示するReactコンポーネント
 */
const SideMenu = ({ user, className, style }: SideMenuProps) => {
  return (
    <div className={`${className} w-40 space-y-3`} style={style}>
      <div className='flex items-center rounded-lg bg-transparent hover:bg-black/5 hover:cursor-pointer'>
        <CiUser size={28} />
        <a className='pl-1 text-xl'>プロフィール</a>
      </div>
      <div className='flex items-center rounded-lg bg-transparent hover:bg-black/5 hover:cursor-pointer'>
        <CiSettings size={28} />
        <a className='pl-1 text-xl'>設定</a>
      </div>
      <div className='flex items-center rounded-lg bg-transparent hover:bg-black/5 hover:cursor-pointer'>
        <CiLogout size={28} />
        <a className='pl-1 text-xl'>ログアウト</a>
      </div>
      <div className='flex items-center'>
        <Image
          src={user.iconUrl !== '' ? user.iconUrl : '/iconDefault.png'}
          height={28}
          width={28}
          alt='Icon'
          className='rounded-full'
        />
        <a className='pl-1 text-xl'>{user.name}</a>
      </div>
    </div>
  );
};

export default SideMenu;
