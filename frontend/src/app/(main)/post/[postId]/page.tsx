'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { PostTypes } from '@/types/postTypes';
import Post from '@/components/Post';
import fetchOnePost from './actions/fetchOnePost';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * 指定されたIDの投稿を表示する．
 * @async
 * @function Post
 * @returns {JSX.Element} プロフィールを表示するReactコンポーネント
 */
const PostPage = () => {
  const { postId } = useParams() as { postId: string };
  const [post, setPost] = useState<PostTypes | null>(null);
  // セッションの取得
  const session = useSession();
  const router = useRouter();

  // 投稿IDから投稿をFetchする
  useEffect(() => {
    const getPost = async () => {
      if (session.status === 'loading') return;
      if (post) return;
      const data = await fetchOnePost({
        postId: postId as string,
        iconUrl: session.data?.user?.image ?? '',
      });
      if (!data) router.push('/post-not-found');
      setPost(data);
    };
    getPost();
  }, [postId, session.data?.user?.image, session.status, router, post]);

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
            {post && <Post post={post} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostPage;
