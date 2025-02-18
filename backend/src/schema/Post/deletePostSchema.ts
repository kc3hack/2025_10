import { z } from '@hono/zod-openapi';

// リクエストの型
export const deletePostSchema = z.object({
  post_id: z.string().openapi({
    example: '8e21e23a-eb9f-11ef-9ce7-0242ac130002',
    description: '投稿id',
  }),
  user_icon: z.string().openapi({
    example: 'https://avatars.githubusercontent.com/u/131171129?v=4',
    description: 'git hubのアイコンURL',
  }),
});

// レスポンスの型
export const deletePostResponseSchema = z.object({
  message: z.string(),
});
