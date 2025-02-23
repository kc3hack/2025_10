import type { Context } from 'hono';
import { env } from '../config/env.js';

const printLine = (): void => {
  console.log('--------------------------------');
};

const getNews = async () => {
  try {
    const response = await fetch(
      `https://api.currentsapi.services/v1/latest-news?language=ja&apiKey=${env.CURRENTS_API_KEY}`
    );

    // HTTPエラーが発生した場合（たまにここでエラーが起きる）
    if (!response.ok) {
      throw new Error(`【getNews】HTTPエラー: ${response.status}`);
    }

    const data = await response.json();

    // console.log(data);

    // ニュースの取得に失敗した場合
    if (data.status !== 'ok') {
      throw new Error(`【getNews】ニュースの取得に失敗しました。（status: ${data.status}）`);
    }

    const newsArray = data.news;

    let news;
    for (let i = 0; i < newsArray.length; i++) {
      const newsTemp = newsArray[i];
      if (newsTemp.title !== '' && newsTemp.description !== '' && newsTemp.url !== '') {
        news = newsTemp;
        break;
      }
    }

    if (!news) {
      throw new Error('【getNews】表示できるニュースがありません。');
    }
    return {
      isSuccess: true,
      news: {
        title: news.title,
        description: news.description,
        url: news.url,
      },
    };
  } catch (error: any) {
    console.error(error);
    return {
      isSuccess: false,
      message: error.message,
    };
  }
};

export default getNews;
