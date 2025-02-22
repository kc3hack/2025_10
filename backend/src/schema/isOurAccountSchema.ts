import { z } from '@hono/zod-openapi';

// リクエストの型
export const isOurAccountSchema = z.object({
  icon_url: z.string().openapi({
    example: 'https://avatars.githubusercontent.com/u/131171129?v=4',
    description: 'icon_URLを入力',
  }),
});

// レスポンスの型
export const isOurAccountResponseSchema = z.object({
  message: z.string(),
  isOurAccount: z.boolean(),
});
