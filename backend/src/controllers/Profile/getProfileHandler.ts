import { z, type RouteHandler } from '@hono/zod-openapi';
import type { Context } from 'hono';
import db from '../db.js';
import { getProfileSchema } from '../../schema/Profile/getProfileSchema.js';
import type { getProfileRoute } from '../../routes/Profile/getProfileRoute.js';
import { env } from '../../config/env.js';

type getProfileSchema = z.infer<typeof getProfileSchema>;

const getProfileHandler: RouteHandler<typeof getProfileRoute, {}> = async (c: Context) => {
  try {
    // 受け取ったjsonを各変数に格納
    const { user_id } = await c.req.json<getProfileSchema>();

    // 指定ユーザが存在するか確認
    const checkSql = `SELECT * FROM ${env.USERS_TABLE_NAME} WHERE id = :user_id;`;
    const existingUser = await db.query(checkSql, { user_id });
    if (existingUser.length == 0) {
      console.log('ユーザが見つかりません．');
      return c.json(
        {
          message: 'ユーザが見つかりません．',
          statusCode: 404,
          error: 'Not Found',
        },
        404
      );
    }

    // ユーザ名とユーザアイコンの取得
    const userSql = `SELECT * FROM ${env.USERS_TABLE_NAME} WHERE id = :user_id;`;
    const result = await db.query(userSql, { user_id });
    const { name: user_name, icon: user_icon } = result[0];

    // 総獲得雅数を取得
    const sql = `SELECT COUNT(*) FROM ${env.MIYABI_TABLE_NAME} miyabi LEFT JOIN ${env.POSTS_TABLE_NAME} post ON miyabi.post_id = post.id WHERE post.user_icon = :user_icon;`;
    const total_miyabi = await db.query(sql, { user_icon });

    // 総投稿数を取得
    const sql2 = `SELECT COUNT(*) FROM ${env.POSTS_TABLE_NAME} WHERE user_icon = :user_icon;`;
    const total_post = await db.query(sql2, { user_icon });

    // レスポンス
    console.log('プロフィールを取得しました．');
    return c.json(
      {
        message: 'プロフィールを取得しました．',
        user_id: user_id,
        user_name: user_name,
        user_icon: user_icon,
        total_miyabi: total_miyabi[0]['COUNT(*)'],
        total_post: total_post[0]['COUNT(*)'],
      },
      200
    );
  } catch (err) {
    console.log('プロフィールの取得に失敗しました．');
    return c.json(
      {
        message: 'プロフィールの取得に失敗しました．',
        statusCode: 500,
        error: 'Internal Server Error',
      },
      500
    );
  }
};

export default getProfileHandler;
