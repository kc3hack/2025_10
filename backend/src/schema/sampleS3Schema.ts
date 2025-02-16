import { z } from '@hono/zod-openapi';

// リクエストの型
const IMAGE_FILE_TYPE = ['image/jpeg', 'image/png']; // jpeg, pngのみ
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// ファイルサイズをMBに変換
const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
  const result = sizeInBytes / (1024 * 1024);
  return +result.toFixed(decimalsNum);
};

export const sampleUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => sizeInMB(file.size) <= MAX_FILE_SIZE, {
      message: 'ファイルサイズは最大10MBだよ',
    })
    .refine((file) => IMAGE_FILE_TYPE.includes(file.type), {
      message: 'jpeg, pngのみだよ',
    }),
});

// レスポンスの型
export const sampleUploadResponseSchema = z.object({
  url: z.string().openapi({
    example: 'https://example.com/file.jpg',
    description: 'ファイルのURL',
  }),
});

export const sampleDownloadSchema = z.object({
  url: z.string().openapi({
    example: 'https://example.com/file.jpg',
    description: 'ファイルのURL',
  }),
});

export const sampleDownloadResponseSchema = z.object({
  file: z.instanceof(Buffer),
});
