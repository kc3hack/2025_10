import { z, type RouteHandler } from '@hono/zod-openapi';
import type { Context } from 'hono';
import db from '../db.js';
import { getPostSchema } from '../../schema/Post/getPostSchema.js';
import type { getPostRoute } from '../../routes/Post/getPostRoute.js';
import { env } from '../../config/env.js';

type getPostSchema = z.infer<typeof getPostSchema>;

const getPostHandler: RouteHandler<typeof getPostRoute, {}> = async (c: Context) => {
  try {
    // 最新の投稿idを取得
    const latest_post_id = await db.query(
      `SELECT id FROM ${env.POSTS_TABLE_NAME} ORDER BY created_at DESC LIMIT 1;`
    );
    // 受け取ったjsonを各変数に格納
    const {
      limit,
      my_icon,
      post_id = latest_post_id[0].id,
      user_icon = null,
    } = await c.req.json<getPostSchema>();

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

    // 入力のpost_idがundifinedなら最新の投稿から取得，そうでなければその投稿よりも古いものを取得
    let symbol;
    if (post_id == latest_post_id[0].id) {
      symbol = '<=';
    } else {
      symbol = '<';
    }

    // user_iconがnullなら
    let user_query;
    if (user_icon == null) {
      user_query = '';
    } else {
      user_query = 'AND post.user_icon = :user_icon';
    }

    let results;
    // ここからDBのpostテーブルへ情報登録
    const sql = `
      SELECT 
        post.id, 
        post.original,
        post.tanka,
        post.image_path,
        post.created_at,
        post.user_name,
        post.user_icon, 
        (SELECT COUNT(*) FROM ${env.MIYABI_TABLE_NAME} WHERE post_id = post.id) as miyabi_count,
        CASE WHEN miyabi.id IS NULL THEN false ELSE true END as is_miyabi
      FROM ${env.POSTS_TABLE_NAME} post
      LEFT JOIN ${env.MIYABI_TABLE_NAME} miyabi
        ON post.id = miyabi.post_id AND miyabi.user_icon = :my_icon
      WHERE post.created_at ${symbol} (
          SELECT created_at 
          FROM ${env.POSTS_TABLE_NAME} 
          WHERE id = :post_id
        )
      ${user_query}
      ORDER BY post.created_at DESC 
      LIMIT :limit
    `;
    console.log(user_icon);
    results = await db.query(sql, { limit, my_icon, post_id, user_icon });

    // レスポンス
    return c.json(
      {
        message: '投稿を取得しました．',
        posts: results,
      },
      200
    );
  } catch (err) {
    return c.json(
      {
        message: '投稿の取得に失敗しました．',
        statusCode: 500,
        error: 'Internal Server Error',
      },
      500
    );
  }
};

export default getPostHandler;
