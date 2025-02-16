'use client';

import React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { PostTypes } from '@/types/postTypes';
import PostList from '@/components/PostList';
import fetchPosts from '@/app/timeline/actions/fetchPosts';
import FloatingActionButton from '@/components/FloatingActionButton';
import { MdOutlineMenu } from 'react-icons/md';
import SideMenu from '@/components/SideMenu';
import Image from 'next/image';

const LIMIT = 10;

const Timeline = () => {
  // 投稿データの配列
  const [posts, setPosts] = useState<PostTypes[]>([]);
  // 投稿取得時のオフセットID
  const [offsetId, setOffsetId] = useState('');
  // データ取得中かどうかのフラグ
  const [isLoading, setIsLoading] = useState(false);
  // これ以上取得できる投稿があるかのフラグ
  const [hasMore, setHasMore] = useState(true);
  // ログインしているユーザを保持するState
  const [user, setUser] = useState({ name: 'Name', bio: 'bio', iconUrl: '/iconDefault.png' });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  //IntersectionObserverを保持するためのref
  const observer = useRef<IntersectionObserver | null>(null);

  /**
   * 追加の投稿データを取得し，状態を更新する非同期関数のCallback Ref
   * @async
   * @function loadMorePosts
   * @returns {Promise<void>} 投稿データの取得と状態更新が完了するPromise
   */
  const loadMorePosts = useCallback(async () => {
    setIsLoading(true);
    // 投稿データを取得
    const newPosts = await fetchPosts({ limit: LIMIT, offsetId });
    if (newPosts && newPosts.length > 0) {
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setOffsetId(() => newPosts[1].id);
      // 取得した投稿数がLIMIT未満の場合は，これ以上取得できる投稿は無い．
      if (newPosts.length < LIMIT) {
        setHasMore(false);
      }
    } else {
      // 投稿が取得できなかった場合は，これ以上取得できる投稿は無いとする．
      setHasMore(false);
    }
    setIsLoading(false);
  }, [offsetId]);

  // ターゲットの要素を監視するためのcallback ref
  const targetRef = useCallback(
    (node: HTMLDivElement | null) => {
      // すでに読み込み中の場合は無視
      if (isLoading) return;

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
    [isLoading, hasMore, loadMorePosts]
  );

  // 初回レンダリング時に最初の投稿を取得
  useEffect(() => {
    loadMorePosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='relative min-h-screen'>
      {/* ヘッダ */}
      <div className='fixed top-0 w-full h-12 flex items-center justify-center text-2xl font-kokuryu bg-white z-40'>
        <MdOutlineMenu
          onClick={() => {
            setIsMenuOpen(true);
            console.log('open');
          }}
          className='absolute left-3 lg:hidden'
        />
        <div className=''>Tankalizer</div>
      </div>

      {/* 背景画像 */}
      <div className='fixed top-0 left-0 w-full h-screen z-[-1] opacity-20'>
        <Image src='/bg.jpg' layout='fill' objectFit='cover' alt='Background'></Image>
      </div>

      {/* タイムライン */}
      <div className='pt-12'>
        <div className='relative max-w-lg mx-auto'>
          <SideMenu
            user={user}
            className='hidden lg:block absolute top-5'
            style={{ left: '-12rem' }}
          />
          <PostList posts={posts} className='mx-auto max-w-sm lg:max-w-lg' />
          {isLoading && <p className='text-center py-3'>投稿を取得中...</p>}
          <div ref={targetRef} className='h-px' />
          {!hasMore && <p className='text-center py-3'>これ以上投稿はありません</p>}
        </div>
      </div>

      {/* 投稿（詠）ボタン */}
      <FloatingActionButton />

      {/* ハンバーガーメニュー */}
      {isMenuOpen && (
        <div className='fixed inset-0 justify-center z-50 lg:hidden'>
          <div className='flex w-full h-fit py-4 bg-white'>
            <SideMenu user={user} className='mx-auto' />
          </div>
          <div
            onClick={() => setIsMenuOpen(false)}
            className='w-full h-full bg-black bg-opacity-50'
          ></div>
        </div>
      )}
    </div>
  );
};

export default Timeline;
