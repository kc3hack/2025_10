'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useContext } from 'react';
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useSelectedLayoutSegment } from 'next/navigation';

/**
 * ページ遷移アニメーション
 */
export default function MotionWrapper({ children }: { children: React.ReactNode }) {
  const pathName = useSelectedLayoutSegment();
  return (
    <>
      <AnimatePresence mode='wait' onExitComplete={() => window.scrollTo(0, 0)}>
        <motion.div
          key={pathName}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut', delay: 0 }}
        >
          <FrozenRouter>{children}</FrozenRouter>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

/**
 * 以前のレンダリングの値を保持するhooks
 */
function usePreviousValue<T>(value: T): T | undefined {
  const prevValue = useRef<T | undefined>(undefined);

  useEffect(() => {
    prevValue.current = value;
    return () => {
      prevValue.current = undefined;
    };
  });

  return prevValue.current;
}

/**
 * ルーティングコンテキストを操作して、ちらつきを防ぐ
 */
function FrozenRouter(props: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext);
  const prevContext = usePreviousValue(context) || null;

  const segment = useSelectedLayoutSegment();
  const prevSegment = usePreviousValue(segment);

  const changed = segment !== prevSegment && segment !== undefined && prevSegment !== undefined;

  return (
    <LayoutRouterContext.Provider value={changed ? prevContext : context}>
      {props.children}
    </LayoutRouterContext.Provider>
  );
}
