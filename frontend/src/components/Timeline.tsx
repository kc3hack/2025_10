'use client';

import React from 'react';
import { useState, useRef, useCallback } from 'react';
import { PostTypes } from '@/types/postTypes';
import PostList from '@/components/PostList';
import fetchPosts from '@/app/timeline/actions/fetchPosts';
import { useSession } from 'next-auth/react';

// props の型定義
interface TimelineProps {
  limit: number;
  max: number;
  targetUserUrl?: string;
  className?: string;
}

/**
 * タイムラインを表示するコンポーネント
 * @component Timeline
 * @param {TimelineProps} props - タイムラインのデータを含むオブジェクト
 * @return {JSX.Elements} タイムラインを表示するReactコンポーネント
 */
const Timeline = ({ limit, max, targetUserUrl, className }: TimelineProps) => {
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
    const newPosts = await fetchPosts({
      limit: limit,
      iconUrl: session.data?.user?.image ?? '',
      offsetId: offsetIdRef.current,
      targetUserUrl: targetUserUrl,
    });
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
  }, [limit, max, targetUserUrl, session.status, session.data?.user?.image]);

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

  return (
    <div className={`${className}`}>
      <PostList posts={posts} className='mx-auto max-w-sm lg:max-w-lg' onDelete={deletePost} />
      {hasMore && <p className='py-3 text-center'>投稿を取得中...</p>}
      <div ref={targetRef} className='h-px' />
      {!hasMore && <p className='py-3 text-center'>これ以上投稿を取得できません。</p>}
    </div>
  );
};

export default Timeline;
