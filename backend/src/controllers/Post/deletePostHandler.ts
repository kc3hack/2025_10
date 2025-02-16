import { z, type RouteHandler } from '@hono/zod-openapi';
import type { Context } from 'hono';
import db from '../db.js';
import { deletePostSchema } from '../../schema/Post/deletePostSchema.js';
import type { deletePostRoute } from '../../routes/Post/deletePostRoute.js';
import { env } from '../../config/env.js';

type deletePostSchema = z.infer<typeof deletePostSchema>;

const deletePostHandler: RouteHandler<typeof deletePostRoute, {}> = async (c: Context) => {
  try {
    // 受け取ったjsonを各変数に格納
    const { post_id, user_icon } = await c.req.json<deletePostSchema>();

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

    // 消したがってる人と投稿者が一致するかチェック
    const checkSql2 = `SELECT * FROM ${env.POSTS_TABLE_NAME} WHERE id = :post_id;`;
    const postInfo = await db.query(checkSql2, { post_id });
    if (postInfo[0].user_icon != user_icon) {
      return c.json(
        {
          message: '許可がありません．',
          statusCode: 403,
          error: 'Forbidden',
        },
        403
      );
    }

    // ここからDBのpostテーブルからの削除処理
    // user_iconが投稿のuser_iconと一致していれば削除
    const sql = `delete from ${env.POSTS_TABLE_NAME} where id = :post_id and user_icon = :user_icon;`;
    await db.query(sql, { user_icon, post_id });

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

export default deletePostHandler;
