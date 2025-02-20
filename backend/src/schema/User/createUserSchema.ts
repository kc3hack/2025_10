import { z } from '@hono/zod-openapi';

// リクエストの型
export const createUserSchema = z.object({
  name: z.string().openapi({
    example: 'TARO-gh',
    description: 'ユーザ名',
  }),
  icon: z.string().openapi({
    example: 'https://avatars.githubusercontent.com/u/131171129?v=4',
    description: 'githubのアイコンURL',
  }),
});

// レスポンスの型
export const createUserResponseSchema = z.object({
  message: z.string(),
});
