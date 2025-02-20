import { z } from '@hono/zod-openapi';

// リクエストの型
export const getProfileSchema = z.object({
  user_id: z.string().openapi({
    example: '131171129',
    description: 'git hubのアイコンURLに含まれる数字列',
  }),
});

// レスポンスの型
export const getProfileResponseSchema = z.object({
  message: z.string(),
  user_id: z.string(), // ユーザid
  user_name: z.string(), // ユーザ名
  user_icon: z.string(), // ユーザアイコン
  total_miyabi: z.number(), // 総獲得雅数
  total_post: z.number(), // 総投稿数
});
