// クライアントコンポーネント
'use client';

import { CiUser, CiSettings, CiLogout } from 'react-icons/ci';
import Image from 'next/image';
import { UserTypes } from '@/types/userTypes';

// props の型定義
interface SideMenuProps {
  user: UserTypes;
  className?: string;
}

/**
 * サイドメニューを表示するコンポーネント
 * @component SideMenu
 * @param {SideMenuProps} props - ユーザデータを含むオブジェクト
 * @return {JSX.Element} サイドメニューを表示するReactコンポーネント
 */
const SideMenu = ({ user, className }: SideMenuProps) => {
  return (
    <div className={`${className} w-40 space-y-3`}>
      <div className='relative group hover:cursor-pointer'>
        <div className='flex items-center'>
          <CiUser size={28} />
          <a className='pl-1 text-xl'>プロフィール</a>
        </div>
        <div
          className='
              absolute inset-0
              bg-black
              opacity-0
              group-hover:opacity-5
              rounded-lg
            '
        />
      </div>
      <div className='relative group hover:cursor-pointer'>
        <div className='flex items-center'>
          <CiSettings size={28} />
          <a className='pl-1 text-xl'>設定</a>
        </div>
        <div
          className='
              absolute inset-0
              bg-black
              opacity-0
              group-hover:opacity-5
              rounded-lg
            '
        />
      </div>
      <div className='relative group hover:cursor-pointer'>
        <div className='flex items-center'>
          <CiLogout size={28} />
          <a className='pl-1 text-xl'>ログアウト</a>
        </div>
        <div
          className='
              absolute inset-0
              bg-black
              opacity-0
              group-hover:opacity-5
              rounded-lg
            '
        />
      </div>
      <div className='relative group'>
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
    </div>
  );
};

export default SideMenu;
