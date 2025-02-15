// クライアントコンポーネント
'use client';

import { PostTypes } from '@/types/postTypes';
import { TankaTypes } from '@/types/tankaTypes';
import React from 'react';

// props の型定義
type PostProps = {
  post: PostTypes;
  className?: string;
};

/**
 * 単一の投稿を表示するコンポーネント
 * @component Post
 * @param {PostProps} props - 投稿データを含むオブジェクト
 * @return {JSX.Element} 投稿を表示するReactコンポーネント
 */
export default function Post({ post, className }: PostProps) {
  // 短歌をパースする
  const tanka = parseTanka(post.tanka);
  // 投稿に画像が含まれるか
  const hasImage = Boolean(post.imageUrl);

  return (
    <div className={`${className} border-b border-gray-500 p-4`}>
      {/* アイコン以外 */}
      <div
        className={`flex justify-center items-start relative w-full aspect-[4/3] overflow-hidden mx-auto ${
          hasImage ? 'cursor-pointer' : ''
        }`}
      >
        <div className='absolute top-1/2 transform -translate-y-1/2 flex justify-center items-start'>
          <p
            className={`self-end font-shinryu ${
              hasImage ? 'text-white' : 'text-black'
            } text-base mr-3 [writing-mode:vertical-rl] [text-orientation:upright]`}
          >
            {post.user.name}
          </p>
          <p
            className={`inline-block align-top font-shinryu ${
              hasImage ? 'text-white' : 'text-black'
            } text-3xl whitespace-pre-line [writing-mode:vertical-rl] [text-orientation:upright]`}
          >
            {tanka}
          </p>
        </div>
      </div>
      <p className='w-full mt-3 whitespace-pre-line break-words text-black'>{post.original}</p>
      <div className='flex mt-3 items-center text-black'>
        {post.date.toLocaleString()}
        <div className='ml-auto flex items-center'>
          <p className='text-sm mr-2'>{post.miyabi.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * 短歌をパースして，改行と全角空白を追加する．
 * @function parseTanka
 * @param {TankaTypes} tanka - 短歌型オブジェクト
 * @return {string} パースされた短歌の文字列
 */
const parseTanka = (tanka: TankaTypes): string => {
  const parsedTanka: string = `${tanka.line1}\n\u3000${tanka.line2}\n\u3000\u3000${tanka.line3}\n${tanka.line4}\n\u3000${tanka.line5}`;
  return parsedTanka;
};
