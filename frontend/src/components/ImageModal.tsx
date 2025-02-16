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
      className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50'
    >
      <div className='relative w-[90vw] h-[90vh]'>
        <Image src={imageUrl} alt='Image' fill className='object-contain' />
      </div>
    </div>
  );
};

export default ImageModal;
