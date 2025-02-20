import React from 'react';
import Link from 'next/link';

const NotFound = () => {
  return (
    <div className='mt-12'>
      <h1 className='text-center text-2xl font-bold'>該当する頁は見当たりませぬ。</h1>
      <Link
        href='/'
        className='mx-auto mt-6 block w-fit rounded-full bg-orange-300 px-8 py-1 hover:opacity-70'
      >
        戻る
      </Link>
    </div>
  );
};

export default NotFound;
