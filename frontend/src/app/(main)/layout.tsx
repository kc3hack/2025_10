import React from 'react';
import HeaderAndMenu from '@/components/HeaderAndMenu';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <HeaderAndMenu />
      {children}
    </>
  );
};

export default MainLayout;
