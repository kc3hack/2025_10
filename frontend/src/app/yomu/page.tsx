'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.scss';
import { VscClose } from 'react-icons/vsc';
import Dialog from '@/components/Dialog';

const Page = () => {
  const [text, setText] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const router = useRouter();

  // テキストエリアの高さを自動で調整する
  const resizeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;

    setText(e.target.value);
  };

  return (
    <div className='relative min-h-screen'>
      {/* 背景 */}
      <div
        className={`${styles.no_drag} ${styles.no_select} fixed left-0 top-0 size-full bg-black/60`}
      >
        <Image src='/bg.jpg' alt='background' fill className='object-cover opacity-20' />
      </div>

      <div className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full'>
        <div className='max-w-[40rem] h-[30rem] bg-white rounded-lg shadow-lg p-8 mx-auto w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2'>
          <div
            className='block size-8 hover:opacity-70 mb-4'
            onClick={() => {
              if (text.length > 0) {
                // 下書きがあるときは警告を出す
                setIsDialogOpen(true);
              } else {
                // 無いときはそのままタイムラインに戻る
                router.push('/timeline');
              }
            }}
          >
            <VscClose className='size-full' />
          </div>
          <div className='flex items-center gap-4'>
            <Image
              // src={post.user.iconUrl !== '' ? post.user.iconUrl : '/iconDefault.png'}
              src='/iconDefault.png'
              height={50}
              width={50}
              alt='Icon'
              className='rounded-full -mt-5'
            />
            <textarea
              className='w-full resize-none overflow-hidden p-3 outline-none md:text-lg'
              placeholder='いま何してんの？'
              onChange={(e) => {
                resizeTextArea(e);
              }}
            ></textarea>
          </div>
          <button
            className={`absolute bottom-10 left-1/2 -translate-x-1/2 z-30 w-16 h-16 border-2 border-transparent shadow-lg bg-orange-400 hover:bg-orange-500 text-4xl font-bold text-white font-shinryu rounded-full`}
          >
            詠
          </button>
          <p className={text.length < 40 || text.length > 140 ? 'text-red-500' : 'text-green-500'}>
            {text.length}
          </p>
          <Dialog
            isOpen={isDialogOpen}
            description='ページを離れると下書きは保存されません。よろしいですか？'
            isOnlyOK={false}
            yesCallback={() => {
              setIsDialogOpen(false);
              router.push('/timeline'); // 「はい」を押したらタイムラインに戻る
            }}
            noCallback={() => {
              setIsDialogOpen(false);
            }}
            yesText='OK'
            noText='キャンセル'
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
