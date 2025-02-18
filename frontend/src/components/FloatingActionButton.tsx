// クライアントコンポーネント
'use client';

// props の型定義
interface FloatingActionButtonProps {
  className?: string;
  onClick?: () => void;
}

/**
 * FloatingActionButtonを表示するコンポーネント
 * @component FloatingActionButton
 * @param {FloatingActionButtonProps} props - ボタンに関するプロパティを含むオブジェクト
 * @return {JSX.Element} FloatingActionButtonを表示するReactコンポーネント
 */
const FloatingActionButton = ({ onClick, className }: FloatingActionButtonProps) => {
  return (
    <button
      className={`${className} fixed bottom-10 right-10 z-30 flex size-16 items-center justify-center rounded-full
  border-2 border-transparent bg-orange-400 font-shinryu text-4xl font-bold text-white shadow-lg hover:bg-orange-500`}
      onClick={onClick}
    >
      詠
    </button>
  );
};

export default FloatingActionButton;
