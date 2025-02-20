import { z, type RouteHandler } from '@hono/zod-openapi';
import type { Context } from 'hono';
import db from '../db.js';
import { createUserSchema } from '../../schema/User/createUserSchema.js';
import type { createUserRoute } from '../../routes/User/createUserRoute.js';
import { env } from '../../config/env.js';

type createUserSchema = z.infer<typeof createUserSchema>;

const createUserHandler: RouteHandler<typeof createUserRoute, {}> = async (c: Context) => {
  try {
    // 受け取ったjsonを各変数に格納
    const { name, icon } = await c.req.json<createUserSchema>();

    const match = icon.match(/\/u\/(\d+)/);
    let id = null;
    if (match) {
      id = match[1];
    } else {
      return c.json(
        {
          message: 'ユーザidの取得に失敗しました．',
          statusCode: 500,
          error: 'Internal Server Error',
        },
        500
      );
    }

    // ユーザが既に存在するかチェック
    const checkSql = `SELECT * FROM ${env.USERS_TABLE_NAME} WHERE id = :id;`;
    const existingUser = await db.query(checkSql, { id });
    if (existingUser.length == 0) {
      // ユーザが存在しないなら追加
      // ここからDBのusersテーブルへ追加処理
      const sql = `insert into ${env.USERS_TABLE_NAME} (id, name, icon) values (:id, :name, :icon)`;
      await db.query(sql, { id, name, icon });
    }

    // レスポンス
    console.log('ユーザを追加しました．');
    return c.json(
      {
        message: 'ユーザを追加しました．',
      },
      200
    );
  } catch (err) {
    console.log('ユーザの追加に失敗しました．');
    return c.json(
      {
        message: 'ユーザの追加に失敗しました．',
        statusCode: 500,
        error: 'Internal Server Error',
      },
      500
    );
  }
};

export default createUserHandler;
