import { z } from '@hono/zod-openapi';

// リクエストの型
export const helloSchema = z.object({
  id: z.number().openapi({
    example: 1,
    description: 'ユーザーID',
  }),
  password: z.string().openapi({
    example: 'password',
    description: 'パスワード',
  }),
});

// レスポンスの型
export const helloResponseSchema = z.object({
  message: z.string().openapi({
    example: 'Hello Hono!',
    description: 'メッセージサンプル',
  }),
  id: z.number().openapi({
    example: 1,
    description: 'ユーザーIDをそのまま返す',
  }),
  password: z.string().openapi({
    example: 'password',
    description: 'パスワードをそのまま返す',
  }),
});
