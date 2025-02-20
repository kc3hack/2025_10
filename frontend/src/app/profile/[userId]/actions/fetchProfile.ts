// サーバアクション
'use server';

import { ProfileTypes } from '@/types/profileTypes';

const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:8080';

/**
 * プロフィールを取得する非同期関数
 * @async
 * @function fetchProfile
 * @param {Object} params - 投稿データ取得のためのパラメータオブジェクト
 * @param {string} params.userId - ユーザのID
 * @returns {Promise<ProfileTypes>} プロフィールデータを返すPromise．プロフィールが存在しない場合はnullを返す．
 */
const fetchProfile = async ({ userId }: { userId: string }): Promise<ProfileTypes | null> => {
  try {
    const res = await fetch(`${backendUrl}/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
      }),
    });

    // エラーがある場合はnullを返す
    if (!res.ok) {
      console.log(res.statusText);
      return null;
    }

    const json = await res.json();
    const profile: ProfileTypes = {
      userId: json.user_id,
      name: json.user_name,
      iconUrl: json.user_icon,
      totalMiyabi: json.total_miyabi,
      totalPost: json.total_post,
    };
    return profile;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default fetchProfile;
