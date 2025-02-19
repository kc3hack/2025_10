// サーバアクション
'use server';

import { hc } from 'hono/client';
import { AppType } from '../../../../../backend/src/index';
import { PostTypes } from '@/types/postTypes';

const client = hc<AppType>(process.env.BACKEND_URL ?? 'http://localhost:8080');

/**
 * 投稿データを取得する非同期関数
 * @async
 * @function fetchPosts
 * @param {Object} params - 投稿データ取得のためのパラメータオブジェクト
 * @param {number} params.limit - 取得する投稿の最大件数
 * @param {string} params.iconUrl - ユーザのアイコン画像URL
 * @param {string} params.offsetId - 取得を開始する投稿のID（オフセット）
 * @returns {Promise<PostTypes[]>} 投稿データの配列を返すPromise．投稿が存在しない場合は空配列を返す．
 */
const fetchPosts = async ({
  limit,
  iconUrl,
  offsetId,
  targetUserUrl,
}: {
  limit: number;
  iconUrl?: string;
  offsetId?: string;
  targetUserUrl?: string;
}): Promise<PostTypes[] | []> => {
  try {
    const res = await client.timeline.$post({
      json: {
        limit: limit,
        my_icon: iconUrl,
        post_id: offsetId,
        user_icon: targetUserUrl,
      },
    });
    console.log(
      `Loading more Posts...\nlimit: ${limit}\niconUrl: ${iconUrl}\noffsetId: ${offsetId}`
    );

    // エラーがある場合は空の配列を返す
    if (!res.ok) {
      console.log(res.statusText);
      return [];
    }

    const json = await res.json();
    return json.posts.map((post) => ({
      id: post.id,
      tanka: post.tanka,
      original: post.original,
      imageUrl: post.image_path ?? '',
      date: new Date(post.created_at),
      user: {
        name: post.user_name,
        iconUrl: post.user_icon,
      },
      miyabiCount: post.miyabi_count,
      miyabiIsClicked: post.is_miyabi,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default fetchPosts;
