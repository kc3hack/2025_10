import { z, type RouteHandler } from '@hono/zod-openapi';
import type { Context } from 'hono';
import db from '../db.js';
import { createPostSchema } from '../../schema/Post/createPostSchema.js';
import type { createPostRoute } from '../../routes/Post/createPostRoute.js';
import { env } from '../../config/env.js';

type createPostSchema = z.infer<typeof createPostSchema>;

const createPostHandler: RouteHandler<typeof createPostRoute, {}> = async (c: Context) => {
  try {
    // 受け取ったjsonを各変数に格納
    const {
      original,
      tanka,
      image_path = null,
      user_name,
      user_icon,
    } = await c.req.json<createPostSchema>();

    // ここからDBのpostテーブルへ情報登録
    const sql = `insert into ${env.POSTS_TABLE_NAME} (original, tanka, image_path, user_name, user_icon) values (:original, :tanka, :image_path, :user_name, :user_icon)`;
    await db.query(sql, { original, tanka, image_path, user_name, user_icon });

    // レスポンス
    return c.json(
      {
        message: '投稿しました．',
      },
      200
    );
  } catch (err) {
    return c.json(
      {
        message: '投稿に失敗しました．',
        statusCode: 500,
        error: 'Internal Server Error',
      },
      500
    );
  }
};

export default createPostHandler;
