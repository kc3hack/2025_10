import { z } from '@hono/zod-openapi';

// リクエストの型
export const createPostSchema = z.object({
  original: z.string().openapi({
    example: 'これは投稿の原文です．今日からハッカソンの開発期間がスタートしました．',
    description: '原文',
  }),
  image: z
    .custom((val) => val === null || val instanceof Blob || val == '')
    .optional()
    .openapi({
      type: 'string',
      format: 'binary',
      description: '添付画像ファイル',
    }),
  user_name: z.string().openapi({
    example: 'TARO-gh',
    description: 'Git Hubの名前',
  }),
  user_icon: z.string().openapi({
    example: 'https://avatars.githubusercontent.com/u/131171129?v=4',
    description: 'git hubのアイコンURL',
  }),
});

// レスポンスの型
export const createPostResponseSchema = z.object({
  message: z.string(),
  tanka: z.array(z.string()),
});
