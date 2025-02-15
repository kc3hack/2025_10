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
      className={`${className} fixed bottom-10 right-10 z-30 flex items-center justify-center w-16 h-16
  border-2 border-transparent shadow-lg bg-orange-400 hover:bg-orange-500 text-4xl font-bold text-white font-shinryu rounded-full`}
      onClick={onClick}
    >
      詠
    </button>
  );
};

export default FloatingActionButton;
