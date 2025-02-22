// クライアントコンポーネント
'use client';

import { PostTypes } from '@/types/postTypes';
import Post from '@/components/Post';
import { motion } from 'framer-motion';

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
    <div>
      {posts.map((post, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Post post={post} className={className} onDelete={onDelete} />
        </motion.div>
      ))}
    </div>
  );
};

export default PostList;
