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
    // 受け取ったjsonを各変数に格納
    let { limit, my_icon = null } = await c.req.json<getMiyabiRankingSchema>();

    let results;
    // ここからDBのpostテーブルから情報取得
    // 先にMiyabiテーブルでpostごとに雅数を算出，それにpostsテーブルをJOINする？
    const sql = `
      SELECT 
        post.id, 
        post.original,
        post.tanka,
        post.image_path,
        post.created_at,
        post.user_name,
        post.user_icon, 
        COUNT(*) as miyabi_count
      FROM ${env.MIYABI_TABLE_NAME} miyabi
      LEFT JOIN ${env.POSTS_TABLE_NAME} post
        ON miyabi.post_id = post.id
      GROUP BY miyabi.post_id
      ORDER BY miyabi_count DESC
      LIMIT :limit
      ;
    `;

    results = await db.query(sql, { limit, my_icon });
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
