// クライアントコンポーネント
'use client';

import Image from 'next/image';

// props の型定義
interface ImageModalProps {
  imageUrl: string;
  setModalOpen: (open: boolean) => void;
}

/**
 * 画像のモーダルを表示するコンポーネント
 * @component ImageModal
 * @param {PostProps} props - 投稿データを含むオブジェクト
 * @param {string} props.imageUrl - 画像のURL
 * @param {(open: boolean) => void} props.setModalOpen - モーダルの開閉状態を制御する関数
 * @return {JSX.Element} モーダルを表示するReactコンポーネント
 */
const ImageModal = ({ imageUrl, setModalOpen }: ImageModalProps) => {
  return (
    <div
      onClick={() => setModalOpen(false)}
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
    >
      <div className='relative h-[90vh] w-screen lg:w-[90vw]'>
        <Image src={imageUrl} alt='Image' fill className='object-contain' />
      </div>
    </div>
  );
};

export default ImageModal;
