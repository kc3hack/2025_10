// クライアントコンポーネント
'use client';

import { useState } from 'react';
import SideMenu from '@/components/SideMenu';
import { motion, AnimatePresence } from 'framer-motion';
import HambergerButton from './HambergerButton';

/**
 * サイドメニューを表示するコンポーネント
 * @component HeaderAndMenu
 * @param {SideMenuProps} props - ユーザデータを含むオブジェクト
 * @return {JSX.Element} サイドメニューを表示するReactコンポーネント
 */
const HeaderAndMenu = () => {
  // ハンバーガーメニューの開閉状態
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div>
      {/* ヘッダ */}
      <div className='fixed top-0 z-50 flex h-12 w-full items-center justify-center bg-white font-kokuryu text-2xl'>
        <HambergerButton
          onClick={() => {
            if (isMenuOpen) setIsMenuOpen(false);
            else setIsMenuOpen(true);
          }}
          isOpen={isMenuOpen}
          className='fixed -left-3 h-12 w-20 lg:hidden'
        />
        <div className=''>Tankalizer</div>
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
          <div className='fixed inset-0 top-12 z-30 justify-center lg:hidden'>
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
