// クライアントコンポーネント
'use client';

import React, { useState, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { DotLottie } from '@lottiefiles/dotlottie-react';

export interface HambergerButtonProps {
  onClick?: () => void;
  isOpen?: boolean;
  className?: string;
}

const HambergerButton = ({ onClick, isOpen, className }: HambergerButtonProps): React.ReactNode => {
  const [dotlottie, setDotlottie] = useState<DotLottie | undefined>();

  const dotLottieRefCallback = (dotLottie: DotLottie) => {
    if (dotLottie) {
      setDotlottie(dotLottie);
    }
  };

  const openMenuAnimation = () => {
    console.log('open');
    dotlottie?.setMode('forward');
    dotlottie?.play();
  };

  const closeMenuAnimation = () => {
    console.log('close');
    dotlottie?.setMode('reverse');
    dotlottie?.play();
  };

  useEffect(() => {
    if (isOpen) {
      openMenuAnimation();
    } else {
      closeMenuAnimation();
    }
  }, [isOpen]);

  return (
    <button
      onClick={() => {
        onClick?.();
      }}
      className={`${className} mx-auto`}
    >
      <DotLottieReact
        src={'/lottie/hamberger.lottie'}
        segment={[12, 30]}
        autoplay={false}
        loop={false}
        speed={1.2}
        mode='forward'
        className='size-full'
        dotLottieRefCallback={dotLottieRefCallback}
      />
    </button>
  );
};

export default HambergerButton;
