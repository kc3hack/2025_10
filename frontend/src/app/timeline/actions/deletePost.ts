// サーバアクション
'use server';

import { hc } from 'hono/client';
import { AppType } from '../../../../../backend/src/index';

const client = hc<AppType>(process.env.BACKEND_URL ?? 'http://localhost:8080');

/**
 * 投稿データを削除する非同期関数
 * @async
 * @function deletePost
 * @param {Object} params - 投稿データ取得のためのパラメータオブジェクト
 * @param {string} params.iconUrl - ユーザのアイコン画像URL
 * @param {string} params.postId - 削除する投稿のID
 */
const deletePost = async ({ iconUrl, postId }: { iconUrl: string; postId: string }) => {
  try {
    const res = await client.post.$delete({
      json: {
        user_icon: iconUrl,
        post_id: postId,
      },
    });

    // エラーがある場合はログを出力
    if (!res.ok) {
      console.log(res.statusText);
    }
  } catch (error) {
    console.error(error);
  }
};

export default deletePost;
