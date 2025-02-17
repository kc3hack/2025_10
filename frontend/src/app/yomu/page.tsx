'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.scss';
import { VscClose } from 'react-icons/vsc';
import Dialog from '@/components/Dialog';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { judgeImage } from '@/lib/JudgeImage';

const MAX_LENGTH = 140; // 最大文字数
const MIN_LENGTH = 40; // 最小文字数→短歌にいい感じに変換するにはこれくらい必要

const Page = (): React.ReactNode => {
  const session = useSession();

  return (
    <div className='relative min-h-screen'>
      {/* 背景 */}
      <div
        className={`${styles.no_drag} ${styles.no_select} fixed left-0 top-0 size-full bg-black/60`}
      >
        <Image src='/bg.jpg' alt='background' fill className='object-cover opacity-20' />
      </div>

      {session.status === 'loading' ? (
        <p>loading...</p>
      ) : session.status === 'authenticated' ? (
        // ログインしている時はSignedInPageを表示
        <SignedInPage />
      ) : (
        // ログインしていない時はNotSignedInPageを表示
        <NotSignedInPage />
      )}
    </div>
  );
};

interface UploadedFile {
  file: File;
  filePath: string;
}

/**
 * ログインしている時に表示されるページ
 */
const SignedInPage = (): React.ReactNode => {
  const [text, setText] = useState('');
  const [canPost, setCanPost] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const session = useSession();
  const [file, setFile] = useState<UploadedFile | null>(null);

  const [isDragActive, setIsDragActive] = useState(false);

  const router = useRouter();

  const onChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setCanPost(e.target.value.length >= MIN_LENGTH && e.target.value.length <= MAX_LENGTH);
  };

  const yesCallback = useCallback(() => {
    setIsDialogOpen(false);
    router.push('/timeline'); // 「はい」を押したらタイムラインに戻る
  }, [router]);

  const noCallback = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const onDrop = (e: React.DragEvent<HTMLTextAreaElement>): void => {
    e.preventDefault();
    if (e.dataTransfer.files.length !== 1) {
      console.log('ファイルは1つだけアップロードしてください');
      return;
    }

    const file = e.dataTransfer.files[0];

    if (!judgeImage(file)) {
      console.log('画像ファイルをアップロードしてください');
      return;
    }

    const render = new FileReader();
    render.readAsDataURL(file);
    render.onload = () => {
      setFile({ file, filePath: render.result as string });
      console.log('upload');
    };
  };

  return (
    <div className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full'>
      <div
        className={`max-w-[40rem] min-h-[30rem] bg-white rounded-lg shadow-lg p-8 mx-auto w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2`}
      >
        <div
          className='block size-8 hover:opacity-70 mb-4 cursor-pointer'
          onClick={() => {
            if (text.length > 0 || file) {
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
        <div className='flex items-start gap-4'>
          <Image
            src={session.data?.user?.image ?? ''}
            height={50}
            width={50}
            alt='Icon'
            className='rounded-full'
          />
          <textarea
            className={`w-full resize-none overflow-hidden p-3 outline-none md:text-lg border-2 border-dotted rounded-lg ${
              isDragActive ? 'border-red-400' : 'border-opacity-0 border-gray-300'
            } ${file ? '' : 'h-[20rem]'}`}
            placeholder='いま何してんの？'
            onChange={(e) => {
              onChangeTextArea(e);
            }}
            onDrop={(e) => {
              onDrop(e);
              setIsDragActive(false);
            }}
            onDragEnter={() => {
              setIsDragActive(true);
            }}
            onDragLeave={() => {
              setIsDragActive(false);
            }}
          ></textarea>
        </div>
        {file && (
          <div className='mx-auto relative w-1/2 aspect-square mb-4'>
            <Image src={file.filePath} alt='upload' fill className='object-contain rounded' />
            <p className='absolute bottom-0 left-0'>{file.file.name}</p>
          </div>
        )}
        <button
          className={`block mx-auto w-16 h-16 border-2 border-transparent shadow-lg bg-orange-400 hover:bg-orange-500 text-4xl font-bold text-white font-shinryu rounded-full ${
            canPost ? '' : 'opacity-50'
          }`}
          disabled={!canPost}
        >
          詠
        </button>
        <p className={canPost ? 'text-green-500' : 'text-red-500'}>{text.length}</p>
        <Dialog
          isOpen={isDialogOpen}
          description='ページを離れると下書きは保存されません。よろしいですか？'
          isOnlyOK={false}
          yesCallback={yesCallback}
          noCallback={noCallback}
          yesText='OK'
          noText='キャンセル'
        />
      </div>
    </div>
  );
};

/**
 * ログインしていない時に表示されるページ
 */
const NotSignedInPage = (): React.ReactNode => {
  return (
    <div className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full'>
      <div className='max-w-[40rem] h-[30rem] bg-white rounded-lg shadow-lg p-8 mx-auto w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2'>
        <Link
          href='/timeline'
          className='block size-8 hover:opacity-70 mb-4 cursor-pointer'
          onClick={() => {}}
        >
          <VscClose className='size-full' />
        </Link>
        <div className='flex flex-col items-center justify-center'>
          <p className='mb-4'>投稿するにはログインしてください</p>
          <button
            onClick={() => signIn()}
            className='bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded'
          >
            ログイン
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
