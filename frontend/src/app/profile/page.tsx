'use client';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import React from 'react';
import Timeline from '@/components/Timeline';

const ProfileSettings = () => {
  const session = useSession();
  const totalLikes = 120; // 仮のデータ
  const totalPosts = 35; // 仮のデータ

  return (
    <div className='flex justify-center py-10'>
      {/* ヘッダ */}
      <div className='fixed top-0 z-40 flex h-12 w-full items-center justify-center bg-white font-kokuryu text-2xl'>
        <div className=''>Tankalizer</div>
      </div>

      <div className='fixed left-0 top-0 z-[-1] h-lvh w-full opacity-20'>
        <Image src='/bg.jpg' layout='fill' objectFit='cover' alt='Background'></Image>
      </div>

      {session.status === 'authenticated' ? (
        <div className='pt-12'>
          <div className='w-full max-w-xl rounded-2xl  border-2 border-gray-300 bg-gradient-to-r from-amber-100 to-amber-50 shadow-lg'>
            <div className='border-b border-gray-300 py-4 text-center text-xl font-semibold text-gray-700'>
              プロフィール
            </div>
            <div className='space-y-6 p-6'>
              <div className='flex flex-col items-center space-y-4'>
                {session.data.user?.image && (
                  <Image
                    src={session.data.user.image}
                    alt='プロフィール画像'
                    width={100}
                    height={100}
                    className='rounded-full border-2 border-gray-300'
                  />
                )}
                <div className='w-full space-y-2 text-center'>
                  <label htmlFor='name' className='block font-medium text-gray-700'>
                    名前 {session.data.user?.name}
                  </label>
                  <div className='mt-4 text-gray-600'>
                    <p>総雅数: {totalLikes}</p>
                    <p>総投稿数: {totalPosts}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Timeline limit={10} max={100} targetUserUrl={session.data.user?.image ?? ''} />
        </div>
      ) : (
        <div className='text-center text-gray-700'>ログインしてください。</div>
      )}
    </div>
  );
};

export default ProfileSettings;
