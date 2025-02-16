// クライアントコンポーネント
'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';

// 各項目の型定義
export interface DropDownItem {
  label: string;
  onClick: () => void;
  icon: ReactNode;
  color?: string;
  className?: string;
}

// props の型定義
interface DropDownButtonProps {
  className?: string;
  items: DropDownItem[];
}

/**
 * DropDownButtonとそのメニューを表示するコンポーネント
 * @component DropDownButton
 * @param {DropDownButtonProps} props - ボタンに関するプロパティを含むオブジェクト
 * @return {JSX.Element} DropDownButtonを表示するReactコンポーネント
 */
const DropDownButton = ({ className, items }: DropDownButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) return;
      setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropDown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={`${className} relative inline-block`} ref={containerRef}>
      <button
        className='flex mx-auto w-7 h-7 items-center justify-center rounded-full bg-transparent hover:bg-black/25'
        onClick={() => toggleDropDown()}
      >
        <BsThreeDots size={20} />
      </button>
      {isOpen && (
        <ul className='absolute top-3 right-0 w-64 h-fit mt-4 mx-3 p-0 border-2 rounded-xl bg-white border-gray-200 shadow-md z-50'>
          {items.map((item) => (
            <li
              key={item.label}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className={`flex mx-1 my-1 items-center hover:bg-gray-100 rounded-md hover:cursor-pointer ${
                item.className ?? ''
              }`}
            >
              <span style={{ color: item.color ?? 'inherit' }}>{item.icon}</span>
              <span style={{ color: item.color ?? 'inherit' }} className='ml-1'>
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropDownButton;
