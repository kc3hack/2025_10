'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { PostTypes } from '@/types/postTypes';
import Post from '@/components/Post';
import fetchOnePost from './actions/fetchOnePost';

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

  // 投稿IDから投稿をFetchする
  useEffect(() => {
    const getPost = async () => {
      if (session.status === 'loading') return;
      const data = await fetchOnePost({
        postId: postId as string,
        iconUrl: session.data?.user?.image ?? '',
      });
      setPost(data);
    };
    getPost();
  }, [postId, session.data?.user?.image, session.status]);

  return <div className='mx-auto max-w-sm pt-5 lg:max-w-lg'>{post && <Post post={post} />}</div>;
};

export default PostPage;
