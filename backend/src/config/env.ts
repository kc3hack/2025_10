// 環境変数の型定義
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  FRONTEND_URL: z.string().url(),
  PORT: z.coerce.number().optional(),
  GEMINI_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
