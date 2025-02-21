'use client';

import React from 'react';
import Timeline from '@/components/Timeline';
import { formatDateKanji } from '../timeline/utils/kanjiNumber';

const MAX = 10; // タイムラインに表示できる最大投稿数

const Page = () => {
  const dateEnd = new Date();
  const dateStart = new Date(dateEnd.getTime());
  dateStart.setDate(dateStart.getDate() - 7);
  return (
    <div className='relative min-h-screen'>
      {/* タイムライン */}
      <div className='mx-auto max-w-sm pt-5 lg:max-w-lg'>
        <div className='mx-4 rounded-xl border-2 border-gray-300 bg-gradient-to-r from-amber-100 to-amber-50 py-2 text-center shadow-lg'>
          <a className='text-lg font-semibold text-gray-700'>雅ランキング</a>
          <div className='my-1 border-b' />
          <div className='flex items-center justify-center'>
            {formatDateKanji(dateStart, true)}
            <a className='mx-1'>～</a>
            {formatDateKanji(dateEnd, true)}
          </div>
        </div>
        <Timeline limit={MAX} max={MAX} mode='ranking' />
      </div>
    </div>
  );
};

export default Page;
