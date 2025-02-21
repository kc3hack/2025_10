'use client';

import React, { useEffect } from 'react';
import { useState, useRef, useCallback } from 'react';
import { PostTypes } from '@/types/postTypes';
import PostList from '@/components/PostList';
import { fetchPosts, fetchRanking } from '@/app/(main)/timeline/actions/fetchPosts';
import { useSession } from 'next-auth/react';
import { FaArrowUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// props の型定義
interface TimelineProps {
  limit: number;
  max: number;
  targetUserId?: string;
  mode?: 'ranking' | 'timeline';
  className?: string;
}

/**
 * タイムラインを表示するコンポーネント
 * @component Timeline
 * @param {TimelineProps} props - タイムラインのデータを含むオブジェクト
 * @return {JSX.Elements} タイムラインを表示するReactコンポーネント
 */
const Timeline = ({ limit, max, targetUserId, mode = 'timeline', className }: TimelineProps) => {
  // 投稿データの配列
  const [posts, setPosts] = useState<PostTypes[]>([]);
  // 投稿取得時のオフセットID
  const offsetIdRef = useRef('');
  // これ以上取得できる投稿があるかのフラグ
  const [hasMore, setHasMore] = useState(true);
  // セッションの取得
  const session = useSession();
  //IntersectionObserverを保持するためのref
  const observer = useRef<IntersectionObserver | null>(null);
  // 投稿取得の重複実行を防ぐためのref
  const isFetchingRef = useRef(false);
  // 一番上まで戻るボタンの表示状態
  const [showTopButton, setShowTopButton] = useState(false);

  /**
   * 追加の投稿データを取得し，状態を更新する非同期関数のCallback Ref
   * @async
   * @function loadMorePosts
   * @returns {Promise<void>} 投稿データの取得と状態更新が完了するPromise
   */
  const loadMorePosts = useCallback(async () => {
    // セッションロード中なら投稿取得をしない
    if (session.status === 'loading') return;
    // 投稿取得中なら重複実行しない
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    // 投稿データを取得
    let newPosts;
    if (mode === 'timeline') {
      newPosts = await fetchPosts({
        limit: limit,
        iconUrl: session.data?.user?.image ?? '',
        offsetId: offsetIdRef.current,
        targetUserId: targetUserId,
      });
    } else {
      newPosts = await fetchRanking({
        limit: max,
        iconUrl: session.data?.user?.image ?? '',
      });
    }
    if (newPosts && newPosts.length > 0) {
      setPosts((prevPosts) => {
        const updatedPosts = [...prevPosts, ...newPosts];
        if (updatedPosts.length >= max) {
          setHasMore(false);
        }
        return updatedPosts;
      });
      offsetIdRef.current = newPosts[newPosts.length - 1].id;
      // 取得した投稿数がlimit未満の場合は，これ以上取得できる投稿は無い．
      if (newPosts.length < limit) {
        setHasMore(false);
      }
    } else {
      // 投稿が取得できなかった場合は，これ以上取得できる投稿は無いとする．
      setHasMore(false);
    }
    isFetchingRef.current = false;
  }, [limit, max, targetUserId, mode, session.status, session.data?.user?.image]);

  // ターゲットの要素を監視するためのcallback ref
  const targetRef = useCallback(
    (node: HTMLDivElement | null) => {
      // すでに読み込み中の場合は無視
      if (isFetchingRef.current) return;

      // 前回の監視を解除
      if (observer.current) observer.current.disconnect();

      // IntersectionObserverを作成
      observer.current = new IntersectionObserver((entries) => {
        // ターゲット要素が画面内に入り，かつまだ取得できる投稿があれば
        if (entries[0].isIntersecting && hasMore) {
          loadMorePosts();
        }
      });

      //nodeが存在する場合，監視を開始
      if (node) observer.current.observe(node);
    },
    [hasMore, loadMorePosts]
  );

  // 見かけ上の投稿を削除する関数
  const deletePost = (postId: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  // スクロールを監視するためのイベントリスナーの追加
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) {
        setShowTopButton(true);
      } else {
        setShowTopButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`${className}`}>
      <PostList posts={posts} onDelete={deletePost} />
      {hasMore && <p className='py-3 text-center'>短歌を取得中...</p>}
      <div ref={targetRef} className='h-px' />
      {!hasMore && <p className='py-3 text-center'>これ以上短歌を取得できません。</p>}
      <AnimatePresence mode='wait'>
        {showTopButton && (
          <motion.div
            initial={{ opacity: 0, x: '-50%', y: -10 }}
            animate={{ opacity: 1, x: '-50%', y: 0 }}
            exit={{ opacity: 0, x: '-50%', y: -10 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className='fixed left-1/2 top-12 my-5 flex items-center justify-center rounded-xl bg-orange-400 px-3 hover:bg-orange-500'
          >
            <FaArrowUp color='white' />
            <a className='py-1 pl-1 text-white shadow-md hover:cursor-pointer'>最新の短歌に戻る</a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Timeline;
