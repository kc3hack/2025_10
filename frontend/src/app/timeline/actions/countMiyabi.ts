// サーバアクション
'use server';

import { hc } from 'hono/client';
import { AppType } from '../../../../../backend/src/index';

const client = hc<AppType>(process.env.BACKEND_URL ?? 'http://localhost:8080');

/**
 * 雅を増やす非同期関数
 * @async
 * @function addMiyabi
 * @param {Object} params - 雅追加のためのパラメータオブジェクト
 * @param {string} params.iconUrl - ユーザのアイコン画像URL
 * @param {string} params.postId - 雅する投稿のID
 */
export const addMiyabi = async ({ iconUrl, postId }: { iconUrl: string; postId: string }) => {
  try {
    const res = await client.miyabi.$post({
      json: {
        post_id: postId,
        my_icon: iconUrl,
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

/**
 * 雅を減らす非同期関数
 * @async
 * @function removeMiyabi
 * @param {Object} params - 雅追加のためのパラメータオブジェクト
 * @param {string} params.iconUrl - ユーザのアイコン画像URL
 * @param {string} params.postId - 雅する投稿のID
 */
export const removeMiyabi = async ({ iconUrl, postId }: { iconUrl: string; postId: string }) => {
  try {
    const res = await client.miyabi.$delete({
      json: {
        post_id: postId,
        my_icon: iconUrl,
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
