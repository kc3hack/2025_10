import React from 'react';
import { motion } from 'framer-motion';

const Loading = () => {
  return (
    <motion.div
      className='size-10 rounded-full border-[3px] border-gray-500/50 border-t-transparent md:size-12'
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
