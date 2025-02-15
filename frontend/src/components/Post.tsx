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

  return (
    <div className={`${className} border-b border-gray-500 p-4 text-black`}>
      <p
        className={`inline-block align-top font-shinryu text-3xl whitespace-pre-line [writing-mode:vertical-rl] [text-orientation:upright]`}
      >
        {tanka}
      </p>
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
