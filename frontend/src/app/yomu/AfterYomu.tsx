import React from 'react';

import { AnimatePresence, motion } from 'framer-motion';

interface AfterYomuProps {
  tanka: string[];
  imagePath: string;
  userName: string;
  userIconPath: string;
}

/**
 * 短歌投稿したあとのいい感じアニメーション
 * @param props 短歌投稿したあとのいい感じアニメーションのprops
 * @returns
 */
const AfterYomu = ({ tanka, imagePath, userName, userIconPath }: AfterYomuProps) => {
  return (
    <>
      <AnimatePresence>
        <main className={`fixed left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2`}>
          <div className='mx-auto h-[30rem] w-11/12 max-w-[40rem] rounded-lg bg-white p-8 shadow-lg md:w-3/4 lg:w-2/3 xl:w-1/2'></div>
        </main>
      </AnimatePresence>
    </>
  );
};

export default AfterYomu;
