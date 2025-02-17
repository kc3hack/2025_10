/**
 * 画像ファイルかどうかを判断する
 * @param file
 * @returns
 */
export const judgeImage = (file: File): boolean => {
  const imageType = file.type;
  const imageExtensions = ['image/jpeg', 'image/png'];
  return imageExtensions.includes(imageType);
};
