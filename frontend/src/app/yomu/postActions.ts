'use server';

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

const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:8080';

/**
 * 短歌を投稿する
 * @param data 投稿するデータ
 * @returns 投稿結果
 */
export const postYomu = async (data: PostData): Promise<PostResult> => {
  try {
    console.log(data);

    let res;

    const formData = new FormData();
    formData.append('original', data.originalText);
    formData.append('user_name', data.userName);
    formData.append('user_icon', data.userIconPath);

    if (data.imageData) {
      formData.append('image', data.imageData);
      res = await fetch(`${backendUrl}/post`, {
        method: 'POST',
        body: formData,
      });
    } else {
      res = await fetch(`${backendUrl}/post`, {
        method: 'POST',
        body: formData,
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
