// サーバアクション
'use server';

import { PostTypes } from '@/types/postTypes';

const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:8080';

/**
 * 単体の投稿データを取得する非同期関数
 * @async
 * @function fetchOnePost
 * @param {Object} params - 投稿データ取得のためのパラメータオブジェクト
 * @param {string} params.iconUrl - ユーザのアイコン画像URL
 * @param {string} params.postId - 取得する投稿のID（オフセット）
 * @returns {Promise<PostTypes[]>} 投稿データを返すPromise．投稿が存在しない場合はnullを返す．
 */
export const fetchOnePost = async ({
  iconUrl,
  postId,
}: {
  iconUrl?: string;
  postId?: string;
}): Promise<PostTypes | null> => {
  try {
    const res = await fetch(`${backendUrl}/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        my_icon: iconUrl,
        post_id: postId,
      }),
    });

    // エラーがある場合はnullを返す
    if (!res.ok) {
      console.log(res.statusText);
      return null;
    }

    const json = await res.json();
    const post: PostTypes = {
      id: json.id,
      tanka: json.tanka,
      original: json.original,
      imageUrl: json.image_path ?? '',
      date: new Date(json.created_at),
      user: {
        name: json.user_name,
        iconUrl: json.user_icon,
        userId: json.user_id,
      },
      miyabiCount: json.miyabi_count,
      miyabiIsClicked: json.is_miyabi,
      rank: json.rank,
    };
    return post;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default fetchOnePost;
