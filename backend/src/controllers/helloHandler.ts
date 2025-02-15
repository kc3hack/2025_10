/* 

サンプル
id, password をPOSTで受け取り、
message, id, password を返す

*/

import { z, type RouteHandler } from '@hono/zod-openapi';
import type { Context } from 'hono';
import { helloSchema } from '../schema/helloSchema.js';
import type { helloRoute } from '../routes/helloRoute.js';

type helloSchema = z.infer<typeof helloSchema>;

const helloWorldHandler: RouteHandler<typeof helloRoute, {}> = async (c: Context) => {
  // POST サンプル
  const { id, password } = await c.req.json<helloSchema>();
  console.log({ id, password });

  console.log('Hello Hono!');

  /* --- 色々処理 --- */

  // レスポンス
  return c.json(
    {
      message: 'Hello Hono!',
      id: id,
      password: password,
    },
    200
  );
};

export default helloWorldHandler;
