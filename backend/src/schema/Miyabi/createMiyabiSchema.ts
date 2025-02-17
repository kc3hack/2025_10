import { z } from '@hono/zod-openapi';

// リクエストの型
export const createMiyabiSchema = z.object({
  user_icon: z.string().openapi({
    example: 'https://avatars.githubusercontent.com/u/131171129?v=4',
    description: 'git hubのアイコンURL',
  }),
  post_id: z.string().openapi({
    example: '92060c46-ec2d-11ef-9ce7-0242ac130002',
    description: '投稿id',
  }),
});

// レスポンスの型
export const createMiyabiResponseSchema = z.object({
  message: z.string(),
});
