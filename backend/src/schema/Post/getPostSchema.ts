import { z } from '@hono/zod-openapi';

// リクエストの型
export const getPostSchema = z.object({
  limit: z.number().openapi({
    example: 10,
    description: '取得する投稿の数',
  }),
  my_icon: z.string().openapi({
    example:
      'https://avatars.githubusercontent.com/u/131171129?s=400&u=07f7dfa8e99b79f55836a04baf5ae537fc527599&v=4',
    description: 'git hubのアイコンURL',
  }),
  post_id: z.string().optional().openapi({
    example: 'cb3adc47-eba3-11ef-9ce7-0242ac130002',
    description: '投稿id',
  }),
  user_icon: z.string().optional().openapi({
    example:
      'https://avatars.githubusercontent.com/u/131171129?s=400&u=07f7dfa8e99b79f55836a04baf5ae537fc527599&v=4',
    description: 'git hubのアイコンURL',
  }),
});

// postのスキーマ
export const postSchema = z.object({
  id: z.string(),
  original: z.string(),
  tanka: z.array(z.string()),
  image_path: z.string(),
  created_at: z.string(),
  user_name: z.string(),
  user_icon: z.string(),
  miyabi_count: z.number(),
  is_miyabi: z.boolean(),
});

// レスポンスの型
export const getPostResponseSchema = z.object({
  message: z.string(),
  posts: z.array(postSchema),
});
