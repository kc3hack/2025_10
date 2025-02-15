import React from 'react';
import PostList from '@/components/PostList';
import FloatingActionButton from '@/components/FloatingActionButton';

const page = () => {
  // 投稿のサンプル
  const posts = [
    {
      id: 'example_post',
      tanka: {
        line1: 'KANSAI',
        line2: '捉え難しき',
        line3: 'お題かな',
        line4: '古都の熱き歌',
        line5: 'アプリで詠まん',
      },
      original:
        'K.A.N.S.A.Iというお題、どう捉えていいのか難しかった。京都や奈良は昔から短歌がアツいのかな。短歌を使ったアプリ作ろうかな。',
      imageUrl: '',
      date: new Date(),
      user: {
        id: 'example_user',
        name: 'Name',
        bio: 'bio',
        iconUrl: '',
      },
      miyabi: 0,
    },
    {
      id: 'example_post',
      tanka: {
        line1: 'KANSAI',
        line2: '捉え難しき',
        line3: 'お題かな',
        line4: '古都の熱き歌',
        line5: 'アプリで詠まん',
      },
      original:
        'K.A.N.S.A.Iというお題、どう捉えていいのか難しかった。京都や奈良は昔から短歌がアツいのかな。短歌を使ったアプリ作ろうかな。',
      imageUrl: '/imageSample.jpg',
      date: new Date(),
      user: {
        id: 'example_user',
        name: 'Name',
        bio: 'bio',
        iconUrl: '',
      },
      miyabi: 0,
    },
  ];

  return (
    <div className='bg-white min-h-screen relative '>
      {/* 背景画像の設定 */}
      <div className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-center bg-fixed opacity-20" />
      <div className='relative'>
        <PostList posts={posts} className='mx-auto max-w-sm lg:max-w-lg'></PostList>
      </div>
      <FloatingActionButton />
    </div>
  );
};

export default page;
