import { z, type RouteHandler } from '@hono/zod-openapi';
import type { Context } from 'hono';
import db from '../db.js';
import { getMiyabiRankingSchema } from '../../schema/Miyabi/getMiyabiRankingSchema.js';
import type { getMiyabiRankingRoute } from '../../routes/Miyabi/getMiyabiRankingRoute.js';
import { env } from '../../config/env.js';

type getMiyabiRankingSchema = z.infer<typeof getMiyabiRankingSchema>;

const getMiyabiRankingHandler: RouteHandler<typeof getMiyabiRankingRoute, {}> = async (
  c: Context
) => {
  try {
    // 直近一週間で最も雅の多い投稿idを取得
    const hot_post_id = await db.query(
      `SELECT id FROM ${env.POSTS_TABLE_NAME} ORDER BY created_at DESC LIMIT 1;`
    );
    // 受け取ったjsonを各変数に格納 (post_idが指定なしなら，hot_post_idになる)
    let { limit, my_icon = null, post_id = null } = await c.req.json<getMiyabiRankingSchema>();

    // 入力のpost_idがnullならhot_post_idの投稿から取得，そうでなければその投稿よりも雅がすくないものを取得
    // sql文中の比較条件切り替え
    let symbol;
    if (post_id == null || post_id == '') {
      post_id = hot_post_id[0].id;
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
      ORDER BY post.created_at DESC 
      LIMIT :limit
    `;

    results = await db.query(sql, { limit, my_icon, post_id });
    // is_miyabiをtrue or falseで返すための処理
    results = results.map((row: any) => ({
      ...row,
      is_miyabi: row.is_miyabi ? true : false,
    }));

    //console.log(results);

    // レスポンス
    console.log('雅ランキングを取得しました．');
    return c.json(
      {
        message: '雅ランキングを取得しました．',
        posts: results,
      },
      200
    );
  } catch (err) {
    console.log('雅ランキングの取得に失敗しました．');
    return c.json(
      {
        message: '雅ランキングの取得に失敗しました．',
        statusCode: 500,
        error: 'Internal Server Error',
      },
      500
    );
  }
};

export default getMiyabiRankingHandler;
