import React from 'react';
import { motion } from 'framer-motion';

interface LoadingProps {
  className?: string;
  isCenter?: boolean;
}

const Loading = ({ className, isCenter = false }: LoadingProps) => {
  return (
    <motion.div
      className={`size-10 rounded-full border-[3px] border-white/90 border-t-transparent md:size-12 ${className}`}
      initial={{ x: isCenter ? '-50%' : 0, y: isCenter ? '-50%' : 0 }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'linear',
      }}
    />
  );
};

export default Loading;
