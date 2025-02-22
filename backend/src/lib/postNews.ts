import type { Context } from 'hono';
import { env } from '../config/env.js';
import getNews from './getNews.js';
import generateTanka from './gemini.js';
import createPostHandler from '../controllers/Post/createPostHandler.js';

const printLine = (): void => {
  console.log('--------------------------------');
};

const postNews = async (requestApiKey: string) => {
  if (requestApiKey !== env.NEWS_POST_API_KEY) {
    return {
      isSuccess: false,
      tanka: {
        line0: 'APIキーが間違っています',
        line1: '',
        line2: '',
        line3: '',
        line4: '',
      },
    };
  }

  const newsResponse = await getNews();

  // ニュースの取得に失敗した場合
  if (!newsResponse.isSuccess || !newsResponse.news) {
    return {
      isSuccess: false,
      tanka: {
        line0: 'ニュースの取得に失敗しました',
        line1: '',
        line2: '',
        line3: '',
        line4: '',
      },
    };
  }

  const news = newsResponse.news;

  // 投稿の原文
  const originalText = `${news.title}\n${news.description}\n${news.url}`;

  console.log('originalText', originalText);

  try {
    const formData = new FormData();
    formData.append('original', originalText);
    formData.append(
      'user_icon',
      `https://avatars.githubusercontent.com/u/${env.NEWS_USER_ICON}?v=4`
    );
    formData.append('user_name', '風聞');

    const postResponse = await fetch(`http://localhost:8080/post`, {
      method: 'POST',
      body: formData,
    });

    console.log('postResponse', postResponse);

    if (!postResponse.ok) {
      return {
        isSuccess: false,
        tanka: {
          line0: '',
          line1: '',
          line2: '',
          line3: '',
          line4: '',
        },
      };
    }

    const json = await postResponse.json();

    return {
      isSuccess: true,
      tanka: json.tanka,
    };
  } catch (error) {
    console.error(error);
    return {
      isSuccess: false,
      tanka: {
        line0: '投稿に失敗しました',
        line1: '',
        line2: '',
        line3: '',
        line4: '',
      },
    };
  }
};

export default postNews;
