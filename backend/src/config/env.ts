// 環境変数の型定義
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  FRONTEND_URL: z.string().url(),
  PORT: z.coerce.number().optional(),
});

export const env = envSchema.parse(process.env);
