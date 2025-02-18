import { z, type RouteHandler } from '@hono/zod-openapi';
import type { Context } from 'hono';
import db from '../db.js';
import { getPostSchema } from '../../schema/Post/getPostSchema.js';
import type { getPostRoute } from '../../routes/Post/getPostRoute.js';
import { env } from '../../config/env.js';
import { sampleDownloadSchema } from '../../schema/sampleS3Schema.js';
import type { sampleS3DownloadRoute } from '../../routes/sampleS3Route.js';
import { getFileByUrl } from '../../lib/s3-connector.js';

type getPostSchema = z.infer<typeof getPostSchema>;

const getPostHandler: RouteHandler<typeof getPostRoute, {}> = async (c: Context) => {
  try {
    // 最新の投稿idを取得
    const latest_post_id = await db.query(
      `SELECT id FROM ${env.POSTS_TABLE_NAME} ORDER BY created_at DESC LIMIT 1;`
    );
    // 受け取ったjsonを各変数に格納 (post_idが指定なしなら，最新の投稿idになる)
    let {
      limit,
      my_icon = null,
      post_id = null,
      user_icon = null,
    } = await c.req.json<getPostSchema>();

    // 入力のpost_idがnullなら最新の投稿から取得，そうでなければその投稿よりも古いものを取得
    // sql文中の比較条件切り替え
    let symbol;
    if (post_id == null || post_id == '') {
      post_id = latest_post_id[0].id;
      symbol = '<=';
    } else {
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
      symbol = '<';
    }

    // user_iconがnullなら追加条件なし，nullでないならユーザを限定する条件を追加
    let user_query;
    if (user_icon == null || user_icon == '') {
      //console.log('if');
      user_query = '';
    } else {
      user_query = 'AND post.user_icon = :user_icon';
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
      WHERE post.created_at ${symbol} (
          SELECT created_at 
          FROM ${env.POSTS_TABLE_NAME} 
          WHERE id = :post_id
        )
      ${user_query}
      ORDER BY post.created_at DESC 
      LIMIT :limit
    `;

    results = await db.query(sql, { limit, my_icon, post_id, user_icon });
    // is_miyabiをtrue or falseで返すための処理
    results = results.map((row: any) => ({
      ...row,
      is_miyabi: row.is_miyabi ? true : false,
    }));

    //console.log(results);

    // レスポンス
    console.log('投稿を取得しました．');
    return c.json(
      {
        message: '投稿を取得しました．',
        posts: results,
      },
      200
    );
  } catch (err) {
    console.log('投稿の取得に失敗しました．');
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
