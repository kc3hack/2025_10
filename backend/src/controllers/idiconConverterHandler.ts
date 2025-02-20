import { z, type RouteHandler } from '@hono/zod-openapi';
import type { Context } from 'hono';
import { idiconConverterSchema } from '../schema/idiconConverterSchema.js';
import type { idiconConverterRoute } from '../routes/idiconConverterRoute.js';

type idiconConverterSchema = z.infer<typeof idiconConverterSchema>;

const idiconConverterHandler: RouteHandler<typeof idiconConverterRoute, {}> = async (
  c: Context
) => {
  try {
    // 受け取ったjsonを各変数に格納
    const { input } = await c.req.json<idiconConverterSchema>();

    const match = input.match(/\/u\/(\d+)/);

    if (match) {
      const id = match[1];
      // レスポンス
      console.log('icon_urlをidに変換しました．');
      return c.json(
        {
          message: 'icon_urlをidに変換しました．',
          output: id,
        },
        200
      );
    } else {
      const icon_url = `https://avatars.githubusercontent.com/u/${input}?v=4`;
      // レスポンス
      console.log('idをicon_urlに変換しました．');
      return c.json(
        {
          message: 'idをicon_urlに変換しました．',
          output: icon_url,
        },
        200
      );
    }
  } catch (err) {
    console.log('変換に失敗しました．');
    return c.json(
      {
        message: '変換に失敗しました．',
        statusCode: 500,
        error: 'Internal Server Error',
      },
      500
    );
  }
};

export default idiconConverterHandler;
