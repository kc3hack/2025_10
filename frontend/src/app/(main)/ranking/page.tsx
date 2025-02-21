'use client';

import React from 'react';
import Timeline from '@/components/Timeline';

const MAX = 10; // タイムラインに表示できる最大投稿数

const Page = () => {
  return (
    <div className='relative min-h-screen'>
      {/* タイムライン */}
      <div className='mx-auto max-w-lg'>
        <Timeline limit={MAX} max={MAX} mode='ranking' />
      </div>
    </div>
  );
};

export default Page;
