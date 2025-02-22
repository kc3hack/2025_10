// クライアントコンポーネント
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SideMenu from '@/components/SideMenu';
import { MdOutlineMenu } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

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
      {/* ヘッダ */}
      <div className='fixed top-0 z-40 flex h-12 w-full items-center justify-center bg-white font-kokuryu text-2xl'>
        <MdOutlineMenu
          onClick={() => {
            setIsMenuOpen(true);
            console.log('open');
          }}
          className='absolute left-3 lg:hidden'
        />
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
          <div className='fixed inset-0 z-50 justify-center lg:hidden'>
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
