// クライアントコンポーネント
'use client';

// props の型定義
interface FloatingActionButtonProps {
  char: string;
  className?: string;
  onClick?: () => void;
}

/**
 * FloatingActionButtonを表示するコンポーネント
 * @component FloatingActionButton
 * @param {FloatingActionButtonProps} props - ボタンに関するプロパティを含むオブジェクト
 * @return {JSX.Element} FloatingActionButtonを表示するReactコンポーネント
 */
const FloatingActionButton = ({ char, onClick, className }: FloatingActionButtonProps) => {
  return (
    <button
      className={`${className} fixed bottom-5 right-5 z-30 flex size-16 items-center justify-center rounded-full border-2 border-transparent
  bg-orange-400 font-shinryu text-4xl font-bold text-white shadow-lg hover:bg-orange-500 lg:bottom-10 lg:right-10`}
      onClick={onClick}
    >
      {char}
    </button>
  );
};

export default FloatingActionButton;
