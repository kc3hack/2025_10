import { z, type RouteHandler } from '@hono/zod-openapi';
import type { Context } from 'hono';
import db from '../db.js';
import { getOnePostSchema } from '../../schema/Post/getOnePostSchema.js';
import type { getOnePostRoute } from '../../routes/Post/getOnePostRoute.js';
import { env } from '../../config/env.js';

type getOnePostSchema = z.infer<typeof getOnePostSchema>;

const getOnePostHandler: RouteHandler<typeof getOnePostRoute, {}> = async (c: Context) => {
  try {
    // 受け取ったjsonを各変数に格納 (post_idが指定なしなら，最新の投稿idになる)
    let { my_icon = null, post_id } = await c.req.json<getOnePostSchema>();

    // 入力のpost_idがnullなら最新の投稿から取得，そうでなければその投稿よりも古いものを取得
    // sql文中の比較条件切り替え

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

    let results;
    // ここからDBのpostテーブルから情報取得
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
      WHERE post.id = :post_id;
    `;

    results = await db.query(sql, { my_icon, post_id });

    // is_miyabiをtrue or falseで返すための処理
    results = results.map((row: any) => ({
      ...row,
      user_id: row.user_icon.match(/\/u\/(\d+)/)[1],
      is_miyabi: row.is_miyabi ? true : false,
    }));

    //console.log(results);

    // レスポンス
    console.log('投稿を取得しました．');
    return c.json(
      {
        message: '投稿を取得しました．',
        id: results[0].id,
        original: results[0].original,
        tanka: results[0].tanka,
        image_path: results[0].image_path,
        created_at: results[0].created_at,
        user_id: results[0].user_id,
        user_name: results[0].user_name,
        user_icon: results[0].user_icon,
        miyabi_count: results[0].miyabi_count,
        is_miyabi: results[0].is_miyabi,
      },
      200
    );
  } catch (err) {
    console.log('投稿の取得に失敗しました．' + err);
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

export default getOnePostHandler;
