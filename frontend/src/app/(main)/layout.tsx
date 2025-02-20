import React from 'react';
import HeaderAndMenu from '@/components/HeaderAndMenu';
import MotionWrapper from '@/components/MotionWrapper';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <HeaderAndMenu />
      <MotionWrapper>{children}</MotionWrapper>
    </>
  );
};

export default MainLayout;
