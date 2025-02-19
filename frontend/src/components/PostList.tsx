// クライアントコンポーネント
'use client';

import { PostTypes } from '@/types/postTypes';
import Post from '@/components/Post';

// props の型定義
interface PostListProps {
  posts: PostTypes[];
  className?: string;
  onDelete: (postId: string) => void;
}

/**
 * 投稿のリストを表示するコンポーネント
 * @component PostList
 * @param {PostListProps} props - 投稿データの配列を含むオブジェクト
 * @return {JSX.Elements} 投稿リスト表示するReactコンポーネント
 */
const PostList = ({ posts, className, onDelete }: PostListProps) => {
  return (
    <div className='flex-1 overflow-auto'>
      {posts.map((post, i) => (
        <Post key={i} post={post} className={className} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default PostList;
