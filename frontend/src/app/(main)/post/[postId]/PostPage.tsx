'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PostTypes } from '@/types/postTypes';
import Post from '@/components/Post';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * 指定されたIDの投稿を表示する．
 * @async
 * @function Post
 * @returns {JSX.Element} プロフィールを表示するReactコンポーネント
 */
const PostPage = ({ post }: { post: PostTypes | null }) => {
  const router = useRouter();

  return (
    <div>
      {!post && <p className='py-3 text-center'>短歌を取得中...</p>}
      <AnimatePresence mode='wait'>
        {post && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className='mx-auto max-w-sm pt-5 lg:max-w-lg'
          >
            {post && <Post post={post} onDelete={() => router.push('/')} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostPage;
