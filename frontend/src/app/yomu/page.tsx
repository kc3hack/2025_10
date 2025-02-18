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
import { postYomu, PostResult } from './postActions';
import Loading from '@/components/Loading';
import AfterYomu from './AfterYomu';
import { calcFileSize } from '@/lib/CalcFileSize';
import FileUploadButton from '@/components/FileUploadButton';

const MAX_LENGTH = 140; // 最大文字数
const MIN_LENGTH = 40; // 最小文字数→短歌にいい感じに変換するにはこれくらい必要
const MAX_IMAGE_SIZE = 5; // 最大画像サイズ

enum PostStatus {
  INITIAL = 'initial',
  POSTING = 'posting',
  SUCCESS = 'success',
  ERROR = 'error',
}

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
        <p className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>loading...</p>
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
  const [canPost, setCanPost] = useState(false); // 投稿可能か: 文字数から計算する
  const [isDialogOpen, setIsDialogOpen] = useState(false); // 下書き削除のダイアログの表示状態
  const session = useSession();
  const [file, setFile] = useState<UploadedFile | null>(null);

  const [postStatus, setPostStatus] = useState<PostStatus>(PostStatus.INITIAL);
  const [resResult, setResResult] = useState<PostResult | null>(null);

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

  // ドラッグアンドドロップで画像をアップロードする
  const onDrop = (e: React.DragEvent<HTMLTextAreaElement>): void => {
    e.preventDefault();
    if (e.dataTransfer.files.length !== 1) {
      console.log('ファイルは1つだけアップロードしてください');
      alert('ファイルは1つだけアップロードしてください');
      return;
    }

    const file = e.dataTransfer.files[0];
    uploadFile(file);
  };

  // 画像アップロードボタン
  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    uploadFile(file);
  };

  // 画像がインポートされた時の処理
  const uploadFile = (file: File) => {
    if (!judgeImage(file)) {
      console.log('画像ファイルをアップロードしてください');
      alert('画像ファイルをアップロードしてください');
      return;
    }

    if (calcFileSize(file) > MAX_IMAGE_SIZE) {
      console.log(`ファイルサイズが${MAX_IMAGE_SIZE}MBを超えています`);
      alert(`ファイルサイズが${MAX_IMAGE_SIZE}MBを超えています`);
      return;
    }

    const render = new FileReader();
    render.readAsDataURL(file);
    render.onload = () => {
      setFile({ file, filePath: render.result as string });
      console.log('upload');
    };
  };

  // 投稿ボタンを押した時の処理
  const onClickYomuButton = async () => {
    setPostStatus(PostStatus.POSTING);
    // console.log('投稿');
    const res = await postYomu({
      originalText: text,
      imageData: file?.file ?? null,
      userName: session.data?.user?.name ?? '',
      userIconPath: session.data?.user?.image ?? '',
    });

    if (res.message !== '投稿に成功しました') {
      setPostStatus(PostStatus.ERROR);
      return;
    }

    console.log(res);
    setResResult(res);
    setPostStatus(PostStatus.SUCCESS);
  };

  return (
    <>
      <main className='fixed left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2'>
        {/* 投稿フォーム */}
        {postStatus !== PostStatus.SUCCESS && (
          <div
            className={`mx-auto min-h-[30rem] w-11/12 max-w-[40rem] rounded-lg bg-white p-8 shadow-lg md:w-3/4 lg:w-2/3 xl:w-1/2`}
          >
            {/* 閉じるボタン */}
            <div
              className='mb-4 block size-8 cursor-pointer hover:opacity-70'
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

            {/* ユーザーアイコンとテキストエリア */}
            <div className='gap-4 md:flex md:items-start'>
              <Image
                src={session.data?.user?.image ?? ''}
                height={50}
                width={50}
                alt='Icon'
                className='rounded-full'
              />
              <textarea
                className={`w-full resize-none rounded-lg border-2 border-dotted p-3 outline-none md:text-lg ${
                  isDragActive ? 'border-red-400' : 'border-gray-300/0'
                } ${file ? 'min-h-40' : 'min-h-80'}`}
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

            {/* 画像プレビュー */}
            {file && (
              <div className='relative mx-auto mb-4 aspect-square w-1/2'>
                <div className='absolute right-1 top-1 z-10 rounded-lg bg-white/40 hover:bg-white/70'>
                  <VscClose
                    className='size-8 cursor-pointer hover:opacity-70'
                    onClick={() => {
                      setFile(null);
                    }}
                  />
                </div>
                <Image src={file.filePath} alt='upload' fill className='rounded object-contain' />
                <p className='absolute bottom-0 left-0'>{file.file.name}</p>
              </div>
            )}

            {/* 文字数表示 */}
            <p className={`${canPost ? 'text-green-500' : 'text-red-500'} text-right`}>
              {text.length}文字
            </p>

            {/* 投稿ボタン */}
            <button
              className={`mx-auto block size-16 rounded-full border-2 border-transparent bg-orange-400 font-shinryu text-4xl font-bold text-white shadow-lg transition-transform duration-300  ${
                canPost ? 'hover:scale-105 hover:bg-orange-500 active:scale-95' : 'opacity-50'
              }`}
              disabled={!canPost}
              onClick={onClickYomuButton}
            >
              詠
            </button>

            {!canPost && (
              <p className='mt-2 text-center text-sm text-red-500'>
                ※{MIN_LENGTH}文字以上{MAX_LENGTH}文字以内で投稿できます。
              </p>
            )}

            {/* 画像アップロードボタン */}
            <FileUploadButton onChangeFileCallback={onChangeFile} />

            {/* 下書き削除のダイアログ */}
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
        )}
      </main>

      {/* 投稿中ローディング */}
      {postStatus === PostStatus.POSTING && (
        <div className='fixed z-20 size-full bg-black/30'>
          <Loading className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' isCenter />
        </div>
      )}

      {/* 投稿成功時の表示 短歌を表示するアニメーション再生 */}
      {postStatus === PostStatus.SUCCESS && (
        <AfterYomu
          tanka={resResult?.tanka ?? []}
          imagePath={file?.filePath ?? ''}
          userName={session.data?.user?.name ?? ''}
          userIconPath={session.data?.user?.image ?? ''}
        />
      )}
    </>
  );
};

/**
 * ログインしていない時に表示されるページ
 */
const NotSignedInPage = (): React.ReactNode => {
  return (
    <main className='fixed left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2'>
      <div className='mx-auto h-[30rem] w-11/12 max-w-[40rem] rounded-lg bg-white p-8 shadow-lg md:w-3/4 lg:w-2/3 xl:w-1/2'>
        <Link
          href='/timeline'
          className='mb-4 block size-8 cursor-pointer hover:opacity-70'
          onClick={() => {}}
        >
          <VscClose className='size-full' />
        </Link>
        <div className='flex flex-col items-center justify-center'>
          <p className='mb-4'>投稿するにはログインしてください</p>
          <button
            onClick={() => signIn()}
            className='rounded bg-orange-400 px-4 py-2 font-bold text-white hover:bg-orange-500'
          >
            ログイン
          </button>
        </div>
      </div>
    </main>
  );
};

export default Page;
