// クライアントコンポーネント
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SideMenu from '@/components/SideMenu';
import { motion, AnimatePresence } from 'framer-motion';
import HambergerButton from '@/components/HambergerButton';
/**
 * サイドメニューを表示するコンポーネント
 * @component HeaderAndMenu
 * @param {SideMenuProps} props - ユーザデータを含むオブジェクト
 * @return {JSX.Element} サイドメニューを表示するReactコンポーネント
 */
const HeaderAndMenu = () => {
  // ハンバーガーメニューの開閉状態
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <div>
      <HambergerButton
        onClick={() => {
          setIsMenuOpen((prev) => !prev);
        }}
        isOpen={isMenuOpen}
        className='fixed left-0 z-50 h-12 w-14 lg:hidden'
      />
      {/* ヘッダ */}
      <div className='fixed top-0 z-30 flex h-12 w-full items-center justify-center bg-white font-kokuryu text-2xl'>
        <div
          onClick={() => {
            router.push('/');
          }}
          className='hover:cursor-pointer hover:underline'
        >
          Tankalizer
        </div>
      </div>
      {/* サイドメニュー */}
      <div className='pt-12'>
        <div className='mx-auto max-w-lg'>
          <SideMenu className='fixed top-16 hidden -translate-x-full lg:block' />
        </div>
      </div>
      {/* ハンバーガーメニュー */}
      <AnimatePresence mode='wait'>
        {isMenuOpen && (
          <div className='fixed inset-0 z-40 justify-center lg:hidden'>
            <motion.div
              initial={{ opacity: 0, x: '-30%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '-30%' }}
              transition={{ duration: 0.2 }}
              className='flex h-fit w-full bg-white py-4'
            >
              <SideMenu className='mx-auto' setIsOpen={setIsMenuOpen} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMenuOpen(false)}
              className='size-full bg-black/50'
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeaderAndMenu;
