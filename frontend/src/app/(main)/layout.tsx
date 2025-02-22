import React from 'react';
import HeaderAndMenu from '@/components/HeaderAndMenu';
import MotionWrapper from '@/components/MotionWrapper';
import YomuButton from '@/components/YomuButton';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <HeaderAndMenu />
      <MotionWrapper>{children}</MotionWrapper>
      <YomuButton />
    </>
  );
};

export default MainLayout;
