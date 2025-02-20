import React from 'react';
import Link from 'next/link';

const NotFound = () => {
  return (
    <div>
      <h1>該当する頁は見当たりませぬ。</h1>
      <Link href='/'>戻る</Link>
    </div>
  );
};

export default NotFound;
