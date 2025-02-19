import { z } from '@hono/zod-openapi';

// リクエストの型
export const getProfileSchema = z.object({
  user_icon: z.string().optional().openapi({
    example: 'https://avatars.githubusercontent.com/u/131171129?v=4',
    description: 'git hubのアイコンURL',
  }),
});

// レスポンスの型
export const getProfileResponseSchema = z.object({
  message: z.string(),
  total_miyabi: z.number(),
  total_post: z.number(),
});
