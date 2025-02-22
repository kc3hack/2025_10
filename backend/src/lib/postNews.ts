import type { Context } from 'hono';
import { env } from '../config/env.js';
import getNews from './getNews.js';
import generateTanka from './gemini.js';

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

  // そうたさんが作った関数呼ぶ？　原文、画像（不要）、newsユーザーのアイコン画像リンク、ユーザー名（news）
  // const postResponse = createPostHandler(originalText);

  const postResponse = {
    isSuccess: true,
    tanka: {
      line0: 'ニュースです',
      line1: 'これはニュースよ',
      line2: 'ニュースです',
      line3: 'リアルタイムの',
      line4: 'ニュースですわよ',
    },
  };
  return postResponse;
};

export default postNews;
