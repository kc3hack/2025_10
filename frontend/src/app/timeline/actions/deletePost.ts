// サーバアクション
'use server';

const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:8080';

/**
 * 投稿データを削除する非同期関数
 * @async
 * @function deletePost
 * @param {Object} params - 投稿データ取得のためのパラメータオブジェクト
 * @param {string} params.iconUrl - ユーザのアイコン画像URL
 * @param {string} params.postId - 削除する投稿のID
 * @returns {Promise<boolean>} 結果を返すPromise．
 */
const deletePost = async ({
  iconUrl,
  postId,
}: {
  iconUrl: string;
  postId: string;
}): Promise<boolean> => {
  try {
    const res = await fetch(`${backendUrl}/post`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_icon: iconUrl,
        post_id: postId,
      }),
    });

    // エラーがある場合はログを出力
    if (!res.ok) {
      console.log(res.statusText);
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export default deletePost;
