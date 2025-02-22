import { z, type RouteHandler } from '@hono/zod-openapi';
import type { Context } from 'hono';
import { sampleNewsTankaSchema } from '../../schema/Sample/sampleNewsTankaSchema.js';
import type { sampleNewsTankaRoute } from '../../routes/Sample/sampleNewsTankaRoute.js';
import postNews from '../../lib/postNews.js';

type sampleNewsTankaSchema = z.infer<typeof sampleNewsTankaSchema>;

const sampleNewsTankaHandler: RouteHandler<typeof sampleNewsTankaRoute, {}> = async (
  c: Context
) => {
  const { apiKey } = await c.req.json<sampleNewsTankaSchema>();

  /* --- 色々処理 --- */

  const response = await postNews(apiKey);
  console.log(response);

  // レスポンス
  return c.json(response, 200);
};

export default sampleNewsTankaHandler;
