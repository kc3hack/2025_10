import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
interface AfterYomuProps {
  tanka: string[];
  imagePath: string;
  userName: string;
  userIconPath: string;
}

interface TankaChar {
  char: string;
  isNewline: boolean;
  isFirstChar: boolean;
  phraseCount: number;
}

/**
 * 短歌を表示するコンポーネント
 * @param tanka 短歌
 * @param imagePath 画像のパス
 * @param userName ユーザー名
 * @param userIconPath ユーザーアイコンのパス
 * @returns 短歌をいい感じに表示するコンポーネント
 */
const AfterYomu = ({ tanka, imagePath, userName, userIconPath }: AfterYomuProps) => {
  // はんこを表示するかどうか、trueになった時に再生される。短歌の表示アニメーションが終わった時にtrueになる
  const [showHanko, setShowHanko] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const router = useRouter();
  // 短歌のdivへの参照、はんこの位置を計算するため
  const tankaContainerRef = useRef<HTMLDivElement>(null);
  const [hankoPosition, setHankoPosition] = useState({ x: 0, y: 0 });

  // 2次元配列を1次元配列に変換
  const flattenArray = (arr: TankaChar[][]): TankaChar[] => {
    return arr.reduce((acc, val) => acc.concat(val), []);
  };

  const tankaChars: TankaChar[] = flattenArray(
    tanka.map((phrase, phraseCount) => {
      const phraseChars = phrase.split('').map((char, charCount) => {
        return {
          char,
          isNewline: false, // 初期値は false
          isFirstChar: charCount === 0,
          phraseCount,
        };
      });

      // フレーズの最後尾に改行文字を追加
      if (phraseChars.length > 0) {
        phraseChars.push({
          char: '\n',
          isNewline: true,
          isFirstChar: false,
          phraseCount,
        });
      }

      return phraseChars;
    })
  );

  // 短歌全体のアニメーション設定
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5,
      },
    },
  };

  // 短歌の1文字ずつアニメーション
  const charVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
      },
    },
    // 改行時に適応されるアニメーション
    newline: {
      hidden: { opacity: 0, y: 0 },
      visible: {
        opacity: 0,
        y: 0,
        transition: { delay: 1 },
      },
    },
  };

  // はんこのアニメーション設定
  const hankoVariants = {
    hidden: { opacity: 0, scale: 0, rotate: -30 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 15,
        delay: 0,
      },
    },
  };

  // 短歌の表示アニメーションが終わった時に実行、はんこアニメーション再生
  useEffect(() => {
    if (animationComplete) {
      const timer = setTimeout(() => {
        setShowHanko(true);
        if (tankaContainerRef.current) {
          const rect = tankaContainerRef.current.getBoundingClientRect();
          setHankoPosition({
            x: rect.left - 50,
            y: rect.top + rect.height / 2,
          });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [animationComplete]);

  const lineMarginTop = ['mt-0', 'mt-[1em]', 'mt-[2em]', 'mt-[0em]', 'mt-[1em]'];

  return (
    <AnimatePresence mode='wait'>
      <main
        className={`fixed left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 bg-cover bg-center bg-no-repeat`}
      >
        <div
          className={`mx-auto h-auto w-11/12 max-w-[40rem] rounded-lg bg-white/60 bg-cover bg-center bg-no-repeat p-8 shadow-lg md:w-3/4 lg:w-2/3 xl:w-1/2`}
          style={{
            backgroundImage: `url(${imagePath !== '' ? imagePath : '/imageDefault.png'})`, // ユーザーがアップした画像 or デフォルト背景
            backgroundBlendMode: 'lighten',
          }}
        >
          <motion.div
            ref={tankaContainerRef}
            className={`mx-auto w-fit whitespace-pre-wrap font-shinryu text-[9vw] leading-normal md:text-[8vw] lg:text-[5vw] xl:text-[70px] ${
              !showHanko ? 'mb-[88px]' : 'mb-0'
            }`}
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            style={{ writingMode: 'vertical-rl' }}
            onAnimationComplete={() => setAnimationComplete(true)}
          >
            {tankaChars.map((char, index) => {
              return (
                <motion.span
                  key={index}
                  variants={char.isNewline ? charVariants.newline : charVariants}
                  className={char.isFirstChar ? lineMarginTop[char.phraseCount] : ''}
                >
                  {char.isNewline ? <br /> : char.char}
                </motion.span>
              );
            })}
          </motion.div>

          {showHanko && (
            <motion.div
              key='hanko'
              className={`w-fit rounded-md border-2 border-red-700 p-1 text-[1.5rem] leading-normal`}
              style={{ left: hankoPosition.x, top: hankoPosition.y, transform: 'translateY(-50%)' }}
              variants={hankoVariants}
              initial='hidden'
              animate='visible'
              exit='hidden'
            >
              <Image
                src={userIconPath}
                alt='user icon'
                width={40}
                height={40}
                className='rounded-full'
              />
              <span className='mx-1 text-red-700'>{userName}</span>
            </motion.div>
          )}
        </div>
        <button
          key='okButton'
          onClick={() => {
            router.push('/timeline');
          }}
          disabled={!showHanko}
          className={`fixed inset-x-0 bottom-0 mx-auto w-fit translate-y-full rounded-md border-2 border-red-700 bg-orange-400 p-1 px-6 text-[1.5rem] leading-normal transition-transform ${
            showHanko ? 'hover:scale-105 hover:opacity-70 active:scale-95' : 'opacity-40'
          }`}
        >
          OK
        </button>
      </main>
    </AnimatePresence>
  );
};

export default AfterYomu;
