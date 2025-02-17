import { z, type RouteHandler } from '@hono/zod-openapi';
import type { Context } from 'hono';
import db from '../db.js';
import { createPostSchema } from '../../schema/Post/createPostSchema.js';
import type { createPostRoute } from '../../routes/Post/createPostRoute.js';
import { env } from '../../config/env.js';
import generateTanka from '../../lib/gemini.js';
import { sampleUploadSchema } from '../../schema/sampleS3Schema.js';
import type { sampleS3UploadRoute } from '../../routes/sampleS3Route.js';
import { uploadFile } from '../../lib/s3-connector.js';

type createPostSchema = z.infer<typeof createPostSchema>;

const createPostHandler: RouteHandler<typeof createPostRoute, {}> = async (c: Context) => {
  try {
    // 受け取ったデータを各変数に格納
    const formData = await c.req.formData();
    const originalValue = formData.get('original');
    const image = (formData.get('image') as File) || null;
    const user_name = formData.get('user_name');
    const user_icon = formData.get('user_icon');

    if (!originalValue || typeof originalValue !== 'string') {
      console.log('if');
      return c.json(
        {
          message: 'originalはstringである必要があります．',
          statusCode: 400,
          error: 'Bad Request',
        },
        400
      );
    }
    const original = originalValue;

    const tankaArray = await generateTanka(original);
    const tanka = JSON.stringify(tankaArray);

    const image_path = await uploadFile(image);

    //console.log(original);
    //console.log(tanka);
    //console.log(image_path);
    //console.log(user_name);
    //console.log(user_icon);

    // ここからDBのpostテーブルへ情報登録
    const sql = `insert into ${env.POSTS_TABLE_NAME} (original, tanka, image_path, user_name, user_icon) values (:original, :tanka, :image_path, :user_name, :user_icon)`;
    await db.query(sql, { original, tanka, image_path, user_name, user_icon });

    // レスポンス
    return c.json(
      {
        message: '投稿しました．',
        tanka: tankaArray,
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
