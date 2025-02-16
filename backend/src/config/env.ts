// 環境変数の型定義
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  FRONTEND_URL: z.string().url(),
  PORT: z.coerce.number().optional(),
  S3_ACCESS_KEY_ID: z.string(),
  S3_SECRET_ACCESS_KEY: z.string(),
  S3_BUCKET_NAME: z.string(),
});

export const env = envSchema.parse(process.env);
