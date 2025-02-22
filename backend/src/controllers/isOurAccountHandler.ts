import { z, type RouteHandler } from '@hono/zod-openapi';
import type { Context } from 'hono';
import { isOurAccountSchema } from '../schema/isOurAccountSchema.js';
import type { isOurAccountRoute } from '../routes/isOurAccountRoute.js';
import { env } from '../config/env.js';

type isOurAccountSchema = z.infer<typeof isOurAccountSchema>;

const isOurAccountHandler: RouteHandler<typeof isOurAccountRoute, {}> = async (c: Context) => {
  try {
    // 受け取ったjsonを変数に格納
    const { icon_url } = await c.req.json<isOurAccountSchema>();

    // 数字列の抽出
    const match = icon_url.match(/\/u\/(\d+)/);

    // githubのicon_urlか判定
    if (!match) {
      console.log('エラー: GitHubのicon_urlを入力してください．');
      return c.json(
        {
          message: 'エラー: GitHubのicon_urlを入力してください．',
          statusCode: 500,
          error: 'エラー: GitHubのicon_urlを入力してください．',
        },
        500
      );
    }

    const id = match[1];
    const our_id_str = env.OUR_ID;
    const our_idArray = our_id_str.split(',').map((item) => String(item.trim()));

    // envファイルのour_idに含まれる数字列かどうか判定
    if (!our_idArray.includes(id)) {
      // レスポンス
      console.log('私たちのアカウントではありません．');
      return c.json(
        {
          message: '私たちのアカウントではありません．',
          isOurAccount: false,
        },
        200
      );
    }

    // レスポンス
    console.log('私たちのアカウントです．');
    return c.json(
      {
        message: '私たちのアカウントです．',
        isOurAccount: true,
      },
      200
    );
  } catch (err) {
    console.log('アカウントの判定に失敗しました．' + err);
    return c.json(
      {
        message: 'アカウントの判定に失敗しました．',
        statusCode: 500,
        error: 'アカウントの判定に失敗しました．',
      },
      500
    );
  }
};

export default isOurAccountHandler;
