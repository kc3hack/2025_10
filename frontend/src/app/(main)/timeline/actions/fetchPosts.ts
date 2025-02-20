// サーバアクション
'use server';

import { PostTypes } from '@/types/postTypes';

const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:8080';

// response の型定義
interface PostResponse {
  id: string;
  original: string;
  tanka: [];
  image_path: string;
  created_at: string;
  user_name: string;
  user_icon: string;
  user_id: string;
  miyabi_count: number;
  is_miyabi: boolean;
}

/**
 * 投稿データを取得する非同期関数
 * @async
 * @function fetchPosts
 * @param {Object} params - 投稿データ取得のためのパラメータオブジェクト
 * @param {number} params.limit - 取得する投稿の最大件数
 * @param {string} params.iconUrl - ユーザのアイコン画像URL
 * @param {string} params.offsetId - 取得を開始する投稿のID（オフセット）
 * @param {string} params.targetUserId - 取得する対象のユーザID
 * @returns {Promise<PostTypes[]>} 投稿データの配列を返すPromise．投稿が存在しない場合は空配列を返す．
 */
const fetchPosts = async ({
  limit,
  iconUrl,
  offsetId,
  targetUserId,
}: {
  limit: number;
  iconUrl?: string;
  offsetId?: string;
  targetUserId?: string;
}): Promise<PostTypes[] | []> => {
  try {
    const res = await fetch(`${backendUrl}/timeline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        limit: limit,
        my_icon: iconUrl,
        post_id: offsetId,
        user_id: targetUserId,
      }),
    });

    // エラーがある場合は空の配列を返す
    if (!res.ok) {
      console.log(res.statusText);
      return [];
    }

    const json = await res.json();
    return json.posts.map((post: PostResponse) => ({
      id: post.id,
      tanka: post.tanka,
      original: post.original,
      imageUrl: post.image_path ?? '',
      date: new Date(post.created_at),
      user: {
        name: post.user_name,
        iconUrl: post.user_icon,
        userId: post.user_id,
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
