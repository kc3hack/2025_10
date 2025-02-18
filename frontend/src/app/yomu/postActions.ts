'use server';
import { hc } from 'hono/client';
import { AppType } from '../../../../backend/src/index';

interface PostData {
  originalText: string;
  imageData?: File | null;
  userName: string;
  userIconPath: string;
}

export interface PostResult {
  message: string;
  tanka: string[];
}

const client = hc<AppType>(process.env.BACKEND_URL ?? 'http://localhost:8080');

/**
 * 短歌を投稿する
 * @param data 投稿するデータ
 * @returns 投稿結果
 */
export const postYomu = async (data: PostData): Promise<PostResult> => {
  try {
    console.log(data);

    let res;

    if (data.imageData) {
      res = await client.post.$post({
        form: {
          original: data.originalText,
          user_name: data.userName,
          user_icon: data.userIconPath,
        },
      });
    } else {
      res = await client.post.$post({
        form: {
          original: data.originalText,
          user_name: data.userName,
          user_icon: data.userIconPath,
        },
      });
    }

    console.log(res);

    if (!res.ok) {
      return {
        message: '投稿に失敗しました',
        tanka: ['', '', '', '', ''],
      };
    }

    const json = await res.json();

    console.log(json.tanka);
    return {
      message: '投稿に成功しました',
      tanka: json.tanka,
    };
  } catch (error) {
    console.error(error);
    return {
      message: '投稿に失敗しました',
      tanka: ['', '', '', '', ''],
    };
  }
};
