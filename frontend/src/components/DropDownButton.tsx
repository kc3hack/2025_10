// クライアントコンポーネント
'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';

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
  const hasItem = items.length > 0;

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
    <div
      className={`${className} relative inline-block ${hasItem ? '' : 'hidden'}`}
      ref={containerRef}
    >
      <button
        className='mx-auto flex size-7 items-center justify-center rounded-full bg-transparent hover:bg-black/5'
        onClick={() => toggleDropDown()}
      >
        <BsThreeDots size={20} />
      </button>
      <AnimatePresence mode='wait'>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className='absolute right-0 top-3 z-50 mx-3 mt-4 h-fit w-64 rounded-xl border-2 border-gray-200 bg-white p-0 shadow-md'
          >
            {items.map((item) => (
              <li
                key={item.label}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className={`m-1 flex items-center rounded-md hover:cursor-pointer hover:bg-gray-100 ${
                  item.className ?? ''
                }`}
              >
                <span style={{ color: item.color ?? 'inherit' }}>{item.icon}</span>
                <span style={{ color: item.color ?? 'inherit' }} className='ml-1'>
                  {item.label}
                </span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropDownButton;
