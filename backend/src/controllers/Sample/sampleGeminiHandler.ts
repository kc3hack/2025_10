import { z, type RouteHandler } from '@hono/zod-openapi';
import type { Context } from 'hono';
import { sampleGeminiSchema } from '../../schema/Sample/sampleGeminiSchema.js';
import type { sampleGeminiRoute } from '../../routes/Sample/sampleGeminiRoute.js';
import generateTanka from '../../lib/gemini.js';

type sampleGeminiSchema = z.infer<typeof sampleGeminiSchema>;

const sampleGeminiHandler: RouteHandler<typeof sampleGeminiRoute, {}> = async (c: Context) => {
  const { originalText } = await c.req.json<sampleGeminiSchema>();
  console.log({ originalText });

  /* --- 色々処理 --- */

  const response = await generateTanka(originalText);
  console.log(response);

  // レスポンス
  return c.json(response, 200);
};

export default sampleGeminiHandler;
