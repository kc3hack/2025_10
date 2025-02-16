// 環境変数の型定義
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  FRONTEND_URL: z.string().url(),
  PORT: z.coerce.number().optional(),
  RDB_HOST: z.string(),
  RDB_USER: z.string(),
  RDB_PASSWORD: z.string(),
  RDB_NAME: z.string(),
  POSTS_TABLE_NAME: z.string(),
  MIYABI_TABLE_NAME: z.string(),
  S3_ACCESS_KEY_ID: z.string(),
  S3_SECRET_ACCESS_KEY: z.string(),
  S3_BUCKET_NAME: z.string(),
});

export const env = envSchema.parse(process.env);
