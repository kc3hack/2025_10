import { z, type RouteHandler } from '@hono/zod-openapi';
import type { Context } from 'hono';
import { newsTankaSchema } from '../../schema/News/newsTankaSchema.js';
import type { newsTankaRoute } from '../../routes/News/newsTankaRoute.js';
import postNews from '../../lib/postNews.js';

type newsTankaSchema = z.infer<typeof newsTankaSchema>;

const newsTankaHandler: RouteHandler<typeof newsTankaRoute, {}> = async (c: Context) => {
  const { apiKey } = await c.req.json<newsTankaSchema>();

  /* --- 色々処理 --- */

  const response = await postNews(apiKey);
  console.log(response);

  // レスポンス
  return c.json(response, 200);
};

export default newsTankaHandler;
