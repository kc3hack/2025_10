'use client';

import { ReactNode } from 'react';

const kanjiNumeral: Array<[number, string]> = [
  [1000000000000, '兆'],
  [100000000, '億'],
  [10000, '万'],
  [1000, '千'],
  [100, '百'],
  [10, '十'],
];

const kanjiDigits = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

const kanjiRecursive = (value: number): string => {
  let current = value;
  let str = '';

  kanjiNumeral.forEach(([base, char]) => {
    const num = Math.floor(current / base);

    if (!num) return;

    let recurredStr = kanjiRecursive(num);

    if ('千百十'.includes(char) && recurredStr.endsWith('一')) {
      recurredStr = recurredStr.substring(0, recurredStr.length - 1);
    }

    current -= num * base;

    str = `${str}${recurredStr}${char}`;
  });

  return `${str}${kanjiDigits[current]}`;
};

/**
 * numberを漢数字に変換する関数
 * @function toKanjiNumber
 * @param {number} num - 変換対象の数字
 * @returns {string} 変換後の漢数字
 */
export const toKanjiNumber = (num: number): string => {
  if (num === 0) return '零';
  let positive = true;

  if (num < 0) {
    positive = false;
    num = Math.abs(num);
  }

  const str = kanjiRecursive(num);
  return positive ? str : `-${str}`;
};

/**
 * numberの数字を漢数字に置換する関数
 * @function toKanjiNumberSimply
 * @param {number} num - 置換対象の数字
 * @returns {string} 置換後の漢数字
 */
export const toKanjiNumberSimply = (num: number): string => {
  const kanjiDigits = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

  return String(num)
    .split('')
    .map((char) => {
      if (char === '-') return '-';
      return kanjiDigits[Number(char)];
    })
    .join('');
};

/**
 * Dateを漢数字表記に変換する関数
 * @function formatDateKanji
 * @param {Date} date - 変換対象のDate
 * @returns {ReactNode} 変換後のDate
 */
export const formatDateKanji = (date: Date): ReactNode => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  return (
    <p className='text-sm'>
      {`${toKanjiNumberSimply(year)}`}
      <span className='text-xs'>年</span>
      {`${toKanjiNumber(month)}`}
      <span className='text-xs'>月</span>
      {`${toKanjiNumber(day)}`}
      <span className='text-xs'>日</span>
    </p>
  );
};
