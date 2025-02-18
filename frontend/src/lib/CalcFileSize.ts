/**
 * ファイルサイズを計算する
 * @param file ファイル
 * @returns ファイルサイズ(MB)
 */
export const calcFileSize = (file: File): number => {
  return file.size / 1024 / 1024;
};
