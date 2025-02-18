'use client';
import React, { useState } from 'react';
import Image from 'next/image';

export interface GifButtonProps {
  size?: 'small' | 'medium' | 'large';
  gifSrc: string;
  beforeSrc: string;
  afterSrc: string;
  animationDuration?: number;
  initialIsClicked?: boolean;
  onClick?: () => void;
  onCancel?: () => void;
  className?: string;
}

const GifButton = ({
  size,
  gifSrc,
  beforeSrc,
  afterSrc,
  animationDuration,
  initialIsClicked,
  onClick,
  onCancel,
  className,
}: GifButtonProps): React.ReactNode => {
  const sizeClass = size === 'small' ? 'w-10 h-10' : size === 'medium' ? 'w-16 h-16' : 'w-24 h-24';

  const [isClicked, setIsClicked] = useState(initialIsClicked);

  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);

  const clickButton = () => {
    setIsAnimationPlaying(true);
    setTimeout(() => {
      setIsAnimationPlaying(false);
      setIsClicked(true);
    }, animationDuration);
  };

  const cancelButton = () => {
    setIsAnimationPlaying(false);
    setIsClicked(false);
  };

  const switchButton = () => {
    if (isAnimationPlaying) return;
    if (isClicked) {
      cancelButton();
      onCancel?.();
    } else {
      clickButton();
      onClick?.();
    }
  };

  const src = isAnimationPlaying ? gifSrc : isClicked ? afterSrc : beforeSrc;

  return (
    <button
      onClick={switchButton}
      className={`${sizeClass} ${className} relative mx-auto block transition-all duration-300 hover:scale-110`}
    >
      <Image src={src} alt='gif' className='size-full object-cover' fill sizes='object-cover' />
    </button>
  );
};

export default GifButton;
