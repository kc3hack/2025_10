import { z, type RouteHandler } from '@hono/zod-openapi';
import type { Context } from 'hono';
import db from '../db.js';
import { deleteMiyabiSchema } from '../../schema/Miyabi/deleteMiyabiSchema.js';
import type { deleteMiyabiRoute } from '../../routes/Miyabi/deleteMiyabiRoute.js';
import { env } from '../../config/env.js';

type deleteMiyabiSchema = z.infer<typeof deleteMiyabiSchema>;

const deleteMiyabiHandler: RouteHandler<typeof deleteMiyabiRoute, {}> = async (c: Context) => {
  try {
    // 受け取ったjsonを各変数に格納
    const { user_icon, post_id } = await c.req.json<deleteMiyabiSchema>();

    // 投稿が存在するかチェック
    const checkSql = `SELECT * FROM ${env.POSTS_TABLE_NAME} WHERE id = :post_id;`;
    const existingPosts = await db.query(checkSql, { post_id });
    if (existingPosts.length == 0) {
      return c.json(
        {
          message: '投稿が見つかりません．',
          statusCode: 404,
          error: 'Not Found',
        },
        404
      );
    }

    // ここからDBのmiyabiテーブルから削除処理
    const sql = `DELETE FROM ${env.MIYABI_TABLE_NAME} WHERE post_id = :post_id AND user_icon = :user_icon;`;
    await db.query(sql, { user_icon, post_id });

    // レスポンス
    return c.json(
      {
        message: '雅を削除しました．',
      },
      200
    );
  } catch (err) {
    return c.json(
      {
        message: '雅の削除に失敗しました．',
        statusCode: 500,
        error: 'Internal Server Error',
      },
      500
    );
  }
};

export default deleteMiyabiHandler;
