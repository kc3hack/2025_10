'use client';

import GifButton from './GifButton';

interface MiyabiButtonProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  initialIsClicked?: boolean;
  onClick?: () => void;
  onCancel?: () => void;
}

const MiyabiButton = ({
  size = 'large',
  onClick,
  onCancel,
  className,
  initialIsClicked = false,
}: MiyabiButtonProps) => {
  return (
    <GifButton
      size={size}
      gifSrc='/gif/miyabi_button.gif'
      beforeSrc='/gif/miyabi_before.png'
      afterSrc='/gif/miyabi_after.png'
      animationDuration={1100}
      initialIsClicked={initialIsClicked}
      onClick={onClick}
      onCancel={onCancel}
      className={`${className} scale-150 hover:scale-[1.6]`}
    />
  );
};

export default MiyabiButton;
