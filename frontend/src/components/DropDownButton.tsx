// クライアントコンポーネント
'use client';

import { useEffect, useRef, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';

// props の型定義
interface DropDownButtonProps {
  className?: string;
  //onClick?: () => void;
}

const DropDownButton = ({ className }: DropDownButtonProps) => {
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

  const options = [
    { label: '投稿を削除', onClick: () => console.log('aaa') },
    { label: '投稿者をブロック', onClick: () => console.log('bbb') },
    { label: '投稿者をミュート', onClick: () => console.log('ccc') },
  ];

  return (
    <div className={`${className} relative inline-block`} ref={containerRef}>
      <button
        className='flex mx-auto w-7 h-7 items-center justify-center rounded-full bg-transparent hover:bg-black/25'
        onClick={() => toggleDropDown()}
      >
        <BsThreeDots size={20} />
      </button>
      {isOpen && (
        <ul className='absolute top-3 right-0 w-64 h-fit mt-4 mx-3 p-0 border-2 rounded-xl bg-white shadow-md z-50'>
          {options.map((option) => (
            <li
              key={option.label}
              className='mx-1 my-1 hover:bg-gray-400 hover:cursor-pointer'
              onClick={option.onClick}
            >
              <a>{option.label}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropDownButton;
