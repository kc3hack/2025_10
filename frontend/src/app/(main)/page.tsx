'use client';

import React from 'react';
import Timeline from '@/components/Timeline';

const LIMIT = 10; // 一度に取得する投稿数
const MAX = 100; // タイムラインに表示できる最大投稿数

const Page = () => {
  return (
    <div className='relative min-h-screen'>
      {/* タイムライン */}
      <div className='mx-auto max-w-sm lg:max-w-lg'>
        <Timeline limit={LIMIT} max={MAX} />
      </div>
    </div>
  );
};

export default Page;
