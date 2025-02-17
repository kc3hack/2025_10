'use server';
import { hc } from 'hono/client';
import { AppType } from '../../../../backend/src/index';

interface PostData {
  originalText: string;
  imageData?: File | null;
  imagePath?: string;
  userName: string;
  userIconPath: string;
}

export interface PostResult {
  message: string;
  tanka: string[];
  imagePath: string;
  userName: string;
  userIconPath: string;
}

const client = hc<AppType>('http://backend:8080');

/**
 * 短歌を投稿する
 * @param data 投稿するデータ
 * @returns 投稿結果
 */
export const postYomu = async (data: PostData): Promise<PostResult> => {
  try {
    console.log(data);
    const res = await client.post.$post({
      form: {
        original: data.originalText,
        user_name: data.userName,
        user_icon: data.userIconPath,
        image: data.imageData ? data.imageData : null,
      },
    });

    if (!res.ok) {
      return {
        message: '投稿に失敗しました',
        tanka: ['', '', '', '', ''],
        imagePath: '',
        userName: '',
        userIconPath: '',
      };
    }

    const json = await res.json();

    console.log(json.tanka);
    return {
      message: '投稿に成功しました',
      tanka: json.tanka,
      imagePath: data.imagePath ?? '',
      userName: data.userName,
      userIconPath: data.userIconPath,
    };
  } catch (error) {
    console.error(error);
    return {
      message: '投稿に失敗しました',
      tanka: ['', '', '', '', ''],
      imagePath: '',
      userName: '',
      userIconPath: '',
    };
  }
};
