import { z } from '@hono/zod-openapi';

// リクエストの型
export const idiconConverterSchema = z.object({
  input: z.string().openapi({
    example: 'https://avatars.githubusercontent.com/u/131171129?v=4',
    description: 'idかicon_URLを入力',
  }),
});

// レスポンスの型
export const idiconConverterResponseSchema = z.object({
  message: z.string(),
  output: z.string(),
});
