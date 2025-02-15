'use client';
import React, { useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { DotLottie } from '@lottiefiles/dotlottie-react';

export interface ReactionButtonProps {
  size?: 'small' | 'medium' | 'large';
  lottieSrc: string;
  onClick?: () => void;
  className?: string;
}

const ReactionButton = ({
  size,
  lottieSrc,
  onClick,
  className,
}: ReactionButtonProps): React.ReactNode => {
  const sizeClass = size === 'small' ? 'w-10 h-10' : size === 'medium' ? 'w-16 h-16' : 'w-24 h-24';

  const [dotlottie, setDotlottie] = useState<DotLottie | undefined>();

  const dotLottieRefCallback = (dotLottie: DotLottie) => {
    if (dotLottie) {
      setDotlottie(dotLottie);
    }
  };

  const clickButtonAnimation = () => {
    if (dotlottie) {
      dotlottie.play();
    }
  };

  return (
    <button
      onClick={() => {
        clickButtonAnimation();
        onClick?.();
      }}
      className={`${sizeClass} ${className} block mx-auto hover:scale-110 transition-all duration-300`}
    >
      <DotLottieReact
        src={lottieSrc}
        autoplay={false}
        loop={false}
        dotLottieRefCallback={dotLottieRefCallback}
      />
    </button>
  );
};

export default ReactionButton;
