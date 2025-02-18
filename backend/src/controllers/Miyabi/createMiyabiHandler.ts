import { z, type RouteHandler } from '@hono/zod-openapi';
import type { Context } from 'hono';
import db from '../db.js';
import { createMiyabiSchema } from '../../schema/Miyabi/createMiyabiSchema.js';
import type { createMiyabiRoute } from '../../routes/Miyabi/createMiyabiRoute.js';
import { env } from '../../config/env.js';

type createMiyabiSchema = z.infer<typeof createMiyabiSchema>;

const createMiyabiHandler: RouteHandler<typeof createMiyabiRoute, {}> = async (c: Context) => {
  try {
    // 受け取ったjsonを各変数に格納
    const { my_icon, post_id } = await c.req.json<createMiyabiSchema>();

    // 投稿が存在するかチェック
    const checkSql = `SELECT * FROM ${env.POSTS_TABLE_NAME} WHERE id = :post_id;`;
    const existingPosts = await db.query(checkSql, { post_id });
    if (existingPosts.length == 0) {
      console.log('投稿が見つかりません．');
      return c.json(
        {
          message: '投稿が見つかりません．',
          statusCode: 404,
          error: 'Not Found',
        },
        404
      );
    }

    // ここからDBのmiyabiテーブルへ追加処理
    const sql = `insert into ${env.MIYABI_TABLE_NAME} (user_icon, post_id) values (:my_icon, :post_id)`;
    await db.query(sql, { my_icon, post_id });

    // レスポンス
    console.log('雅しました．');
    return c.json(
      {
        message: '雅しました．',
      },
      200
    );
  } catch (err) {
    console.log('雅に失敗しました．');
    return c.json(
      {
        message: '雅に失敗しました．',
        statusCode: 500,
        error: 'Internal Server Error',
      },
      500
    );
  }
};

export default createMiyabiHandler;
