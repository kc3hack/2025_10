import { z, type RouteHandler } from '@hono/zod-openapi';
import type { Context } from 'hono';
import { sampleGeminiSchema } from '../../schema/Sample/sampleGeminiSchema.js';
import type { sampleGeminiRoute } from '../../routes/Sample/sampleGeminiRoute.js';

type sampleGeminiSchema = z.infer<typeof sampleGeminiSchema>;

const sampleGeminiHandler: RouteHandler<typeof sampleGeminiRoute, {}> = async (c: Context) => {
  const { originalText } = await c.req.json<sampleGeminiSchema>();
  console.log({ originalText });

  /* --- 色々処理 --- */

  // レスポンス
  return c.json(
    {
      result: ['短歌の1行目', '短歌の2行目', '短歌の3行目', '短歌の4行目', '短歌の5行目'],
    },
    200
  );
};

export default sampleGeminiHandler;
