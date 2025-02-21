// クライアントコンポーネント
'use client';

import React, { useState } from 'react';
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
    console.log('openMenuAnimation');
    dotlottie?.setMode('forward');
    dotlottie?.play();
  };

  const closeMenuAnimation = () => {
    console.log('closeMenuAnimation');
    dotlottie?.setMode('reverse');
    dotlottie?.play();
  };

  return (
    <button
      onClick={() => {
        if (isOpen) {
          closeMenuAnimation();
        } else {
          openMenuAnimation();
        }
        onClick?.();
      }}
      className={`${className} mx-auto block transition-all duration-300 hover:scale-110`}
    >
      <DotLottieReact
        src={'/lottie/hamberger.lottie'}
        segment={[0, 30]}
        autoplay={false}
        loop={false}
        speed={1.2}
        mode='forward'
        dotLottieRefCallback={dotLottieRefCallback}
      />
    </button>
  );
};

export default HambergerButton;
