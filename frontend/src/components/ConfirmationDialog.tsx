// クライアントコンポーネント
'use client';

export interface ConfirmationDialogOption {
  label: string;
  color?: string;
  onClick: () => void;
}

// props の型定義
interface ConfirmationDialogProps {
  className?: string;
  message: string;
  option1: ConfirmationDialogOption;
  option2: ConfirmationDialogOption;
  setDialogOpen: (open: boolean) => void;
}

/**
 * ConfirmationDialogを表示するコンポーネント
 * @component ConfirmationDialog
 * @param {ConfirmationDialogProps} props - ダイアログに関するプロパティを含むオブジェクト
 * @return {JSX.Element} ConfirmationDialogを表示するReactコンポーネント
 */
const ConfirmationDialog = ({
  className,
  message,
  option1,
  option2,
  setDialogOpen,
}: ConfirmationDialogProps) => {
  return (
    <div className={`${className} fixed inset-0 z-50 flex items-center justify-center bg-black/50`}>
      <div className='size-fit rounded-xl bg-white p-4'>
        {message}
        <div className='mt-5 flex items-center justify-end'>
          <button
            onClick={() => {
              option1.onClick();
              setDialogOpen(false);
            }}
            style={{ color: option1.color ?? 'inherit' }}
            className='rounded-lg px-1 hover:bg-gray-100'
          >
            {option1.label}
          </button>
          <button
            onClick={() => {
              option2.onClick();
              setDialogOpen(false);
            }}
            style={{ color: option2.color ?? 'inherit' }}
            className='ml-2 mr-1 rounded-lg px-1 hover:bg-gray-100'
          >
            {option2.label}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
