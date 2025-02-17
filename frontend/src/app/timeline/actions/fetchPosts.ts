// サーバアクション
'use server';

import { PostTypes } from '@/types/postTypes';

/**
 * 投稿データを取得する非同期関数
 * @async
 * @function fetchPosts
 * @param {Object} params - 投稿データ取得のためのパラメータオブジェクト
 * @param {number} params.limit - 取得する投稿の最大件数
 * @param {string} params.offsetId - 取得を開始する投稿のID（オフセット）
 * @returns {Promise<PostTypes[]>} 投稿データの配列を返すPromise．投稿が存在しない場合は空配列を返す．
 */
const fetchPosts = async ({
  limit,
  offsetId,
}: {
  limit: number;
  offsetId: string;
}): Promise<PostTypes[] | []> => {
  const posts = [
    {
      id: 'example_post',
      tanka: ['KANSAI', '捉え難しき', 'お題かな', '古都の熱き歌', 'アプリで詠まん'],
      original:
        'K.A.N.S.A.Iというお題、どう捉えていいのか難しかった。京都や奈良は昔から短歌がアツいのかな。短歌を使ったアプリ作ろうかな。',
      imageUrl: '',
      date: new Date(),
      user: {
        id: 'example_user',
        name: 'Name',
        bio: 'bio',
        iconUrl: '',
      },
      miyabi: 2222,
    },
    {
      id: 'example_post',
      tanka: ['KANSAI', '捉え難しき', 'お題かな', '古都の熱き歌', 'アプリで詠まん'],
      original:
        'K.A.N.S.A.Iというお題、どう捉えていいのか難しかった。京都や奈良は昔から短歌がアツいのかな。短歌を使ったアプリ作ろうかな。',
      imageUrl: '/imageSample.jpg',
      date: new Date(),
      user: {
        id: 'example_user',
        name: 'Name',
        bio: 'bio',
        iconUrl: '',
      },
      miyabi: 22,
    },
  ];
  console.log(`Loading more Posts... limit: ${limit}, offsetId: ${offsetId}`);

  try {
    return [...posts, ...posts, ...posts, ...posts, ...posts];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default fetchPosts;
