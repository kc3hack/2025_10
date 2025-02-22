'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  const { userId } = useParams() as { userId: string };
  const [profile, setProfile] = useState<ProfileTypes | null>(null);
  const router = useRouter();

  // ユーザIDからプロフィールをFetchする
  useEffect(() => {
    let isMounted = true;
    const getProfile = async () => {
      if (profile) return;
      const data = await fetchProfile({ userId: userId as string });
      if (!isMounted) return;
      if (!data) router.push('/user-not-found');
      setProfile(data);
    };
    getProfile();
    return () => {
      isMounted = false;
    };
  }, [userId, router, profile]);

  // totalPost に応じた背景色のクラスを決定
  const getBackgroundClass = () => {
    const totalPost = profile?.totalPost || 0;

    if (totalPost >= 200) return 'from-purple-700'; // 紫色
    if (totalPost >= 150) return 'from-purple-300'; // 淡い紫色
    if (totalPost >= 100) return 'from-blue-500'; // 青色
    if (totalPost >= 75) return 'from-cyan-300'; // 水色
    if (totalPost >= 50) return 'from-red-700'; // 濃い赤色
    if (totalPost >= 30) return 'from-red-300'; // 淡い赤色
    if (totalPost >= 10) return 'from-yellow-500'; // 濃い黄色
    return 'from-amber-100'; // デフォルト
  };

  return (
    <div>
      <div className='mx-auto max-w-sm pt-5 lg:max-w-lg'>
        <div
          className={`mx-4 rounded-2xl border-2 border-gray-300 bg-gradient-to-r ${getBackgroundClass()} to-amber-50 shadow-lg`}
        >
          <div className='border-b border-gray-300 py-2 text-center text-xl font-semibold text-gray-700'>
            プロフィール
          </div>
          <div className='space-y-6 p-6'>
            <div className='flex flex-col items-center space-y-4'>
              <div className='relative'>
                {/* 中心のプロフィールアイコン */}
                <Image
                  src={profile?.iconUrl ?? '/iconDefault.png'}
                  alt='プロフィール画像'
                  width={100}
                  height={100}
                  className='z-10 rounded-full border-2 border-gray-300'
                />
                {/* 周囲の画像を配置 */}
                <div className='absolute inset-0 flex items-center justify-center'>
                  <Image
                    src='/syodou_fude.png'
                    alt='筆'
                    width={80}
                    height={80}
                    className='absolute left-[-80px] top-[-20px] size-[80px] md:left-[-80px]  lg:left-[-140px] '
                  />
                  <Image
                    src='/syodou_sumi_bou.png'
                    alt='墨棒'
                    width={100}
                    height={100}
                    className='absolute bottom-[-40px] right-[-100px] size-[100px] md:right-[-100px] lg:right-[-140px]'
                  />
                  <Image
                    src='/syodou_suzuri.png'
                    alt='硯'
                    width={80}
                    height={80}
                    className='absolute bottom-[-100px] left-[-80px] size-[80px] md:left-[-80px]  lg:left-[-140px] '
                  />
                </div>
              </div>

              <div className='w-full space-y-2 text-center'>
                <label htmlFor='name' className='block text-lg text-gray-700'>
                  {profile?.name ?? '取得中'}
                </label>
                <div className='mt-4 text-gray-600'>
                  <p>総獲得雅数: {profile?.totalMiyabi ?? '取得中'}</p>
                  <p>総詠歌数: {profile?.totalPost ? `${profile.totalPost}首` : '取得中'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Timeline limit={10} max={100} targetUserId={userId ?? ''} />
      </div>
    </div>
  );
};

export default Profile;
