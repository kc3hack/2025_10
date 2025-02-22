import { z } from '@hono/zod-openapi';

// リクエストの型
export const getOnePostSchema = z.object({
  my_icon: z.string().optional().openapi({
    example: 'https://avatars.githubusercontent.com/u/131171129?v=4',
    description: 'git hubのアイコンURL',
  }),
  post_id: z.string().openapi({
    example: 'cb3adc47-eba3-11ef-9ce7-0242ac130002',
    description: '投稿id',
  }),
});

// レスポンスの型
export const getOnePostResponseSchema = z.object({
  message: z.string(),
  id: z.string(),
  original: z.string(),
  tanka: z.array(z.string()),
  image_path: z.string(),
  created_at: z.string(),
  user_id: z.string(),
  user_name: z.string(),
  user_icon: z.string(),
  miyabi_count: z.number(),
  is_miyabi: z.boolean(),
});
