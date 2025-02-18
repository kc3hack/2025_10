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
import { useSession } from 'next-auth/react';
import LoginDialog from '@/components/LoginDialog';
import { useRouter } from 'next/navigation';

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
  // ハンバーガーメニューの開閉状態
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // セッションの取得
  const session = useSession();
  // ログイン状態
  const isLoggedIn = session.status === 'authenticated';
  // ログイン促進ダイアログの開閉状態
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const router = useRouter();

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
      <div className='fixed top-0 z-40 flex h-12 w-full items-center justify-center bg-white font-kokuryu text-2xl'>
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
      <div className='fixed left-0 top-0 z-[-1] h-screen w-full opacity-20'>
        <Image src='/bg.jpg' layout='fill' objectFit='cover' alt='Background'></Image>
      </div>

      {/* タイムライン */}
      <div className='pt-12'>
        <div className='relative mx-auto max-w-lg'>
          <SideMenu className='absolute top-5 hidden lg:block' style={{ left: '-12rem' }} />
          <PostList posts={posts} className='mx-auto max-w-sm lg:max-w-lg' />
          {isLoading && <p className='py-3 text-center'>投稿を取得中...</p>}
          <div ref={targetRef} className='h-px' />
          {!hasMore && <p className='py-3 text-center'>これ以上投稿はありません</p>}
        </div>
      </div>

      {/* 投稿（詠）ボタン */}
      <FloatingActionButton
        onClick={() => {
          if (isLoggedIn) {
            router.push('/yomu');
          } else {
            setLoginDialogOpen(true);
          }
        }}
      />

      {/* ハンバーガーメニュー */}
      {isMenuOpen && (
        <div className='fixed inset-0 z-50 justify-center lg:hidden'>
          <div className='flex h-fit w-full bg-white py-4'>
            <SideMenu className='mx-auto' />
          </div>
          <div onClick={() => setIsMenuOpen(false)} className='size-full bg-black/50'></div>
        </div>
      )}

      {/* ログイン確認ダイアログ表示が有効の場合，ダイアログを表示する */}
      {loginDialogOpen && <LoginDialog isOpen={loginDialogOpen} setIsOpen={setLoginDialogOpen} />}
    </div>
  );
};

export default Timeline;
