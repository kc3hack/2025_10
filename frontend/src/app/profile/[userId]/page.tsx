'use client';
import Image from 'next/image';
import React from 'react';
import { useParams } from 'next/navigation';
import Timeline from '@/components/Timeline';
import fetchProfile from './actions/fetchProfile';
import { ProfileTypes } from '@/types/profileTypes';

/**
 * 指定されたIDのユーザのプロフィールを表示する．
 * @async
 * @function Profile
 * @returns {JSX.Element} プロフィールを表示するReactコンポーネント
 */
const Profile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = React.useState<ProfileTypes | null>(null);

  // ユーザIDからプロフィールをFetchする
  React.useEffect(() => {
    const getProfile = async () => {
      const data = await fetchProfile({ userId: userId as string });
      setProfile(data);
    };
    getProfile();
  }, [userId]);

  return (
    <div>
      <div className='mx-auto max-w-sm pt-5 lg:max-w-lg'>
        <div className='mx-4 rounded-2xl border-2 border-gray-300 bg-gradient-to-r from-amber-100 to-amber-50 shadow-lg'>
          <div className='border-b border-gray-300 py-2 text-center text-xl font-semibold text-gray-700'>
            プロフィール
          </div>
          <div className='space-y-6 p-6'>
            <div className='flex flex-col items-center space-y-4'>
              <Image
                src={profile?.iconUrl ?? '/iconDefault.png'}
                alt='プロフィール画像'
                width={100}
                height={100}
                className='rounded-full border-2 border-gray-300'
              />
              <div className='w-full space-y-2 text-center'>
                <label htmlFor='name' className='block text-lg text-gray-700'>
                  {profile?.name ?? '取得中'}
                </label>
                <div className='mt-4 text-gray-600'>
                  <p>総雅数: {profile?.totalMiyabi ?? '取得中'}</p>
                  <p>総投稿数: {profile?.totalPost ?? '取得中'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {profile?.iconUrl && <Timeline limit={10} max={100} targetUserUrl={profile?.iconUrl} />}
      </div>
    </div>
  );
};

export default Profile;
