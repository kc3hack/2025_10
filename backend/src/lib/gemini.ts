import type { Context } from 'hono';
import { env } from '../config/env.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const generateTanka = async (originalText: string): Promise<string[]> => {
  // Geminiで短歌生成

  try {
    if (!originalText) {
      throw new Error('原文が指定されていません。');
    }

    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('APIが設定されていません。');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-pro-exp-02-05',
      systemInstruction: `SNSの投稿を短歌にしてください。原文の特徴的な要素はそのままに、比喩表現を使った趣深い短歌にしてください。出力の形式は以下のJSONスキーマに従ってください。各値は日本語で出力してください。
  {
    "type": "object",
    "description": "変換した短歌",
    "properties": {
      "response": {
        "type": "array",
        "description": "ユーザーアカウント作成のレスポンスデータの配列",
        "items": {
          "type": "object",
          "properties": {
            "line1": {
              "type": "string",
              "description": "短歌の1行目, 5文字程度"
            },
            "line2": {
              "type": "string",
              "description": "短歌の2行目, 7文字程度"
            },
            "line3": {
              "type": "string",
              "description": "短歌の3行目, 5文字程度"
            },
            "line4": {
              "type": "string",
              "description": "短歌の4行目, 7文字程度"
            },
            "line5": {
              "type": "string",
              "description": "短歌の5行目, 7文字程度"
            }
          },
          "required": ["line1", "line2", "line3", "line4", "line5"]
        }
      },
      "required": ["response"]
    }
  }`,
      generationConfig: { responseMimeType: 'application/json' },
    });

    const result = await model.generateContent(originalText);
    const jsonResponse = JSON.parse(result.response.text());
    // console.log(jsonResponse);
    // console.log('-----------------------------');

    // ["短歌の1行目", "短歌の2行目", "短歌の3行目", "短歌の4行目", "短歌の5行目"]
    return [
      jsonResponse.response[0].line1,
      jsonResponse.response[0].line2,
      jsonResponse.response[0].line3,
      jsonResponse.response[0].line4,
      jsonResponse.response[0].line5,
    ];
  } catch (error) {
    console.error('APIエラー:', error);
    return [];
  }
};

const getGeminiText = async (c: Context) => {
  try {
    // POSTメソッド以外は拒否
    if (c.req.method !== 'POST') {
      return c.json(
        {
          success: 'false',
          message: {
            status: 405,
            message: 'Bad Request',
            description: 'POSTメソッドでリクエストしてください。',
          },
        },
        405
      );
    }

    // リクエストボディから prompt を取得
    const { prompt } = await c.req.json();
    if (!prompt) {
      return c.json({ error: 'Prompt is required' }, 400);
    }

    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('APIが設定されていません。');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-pro-exp-02-05',
      systemInstruction: `SNSの投稿を短歌にしてください。原文の特徴的な要素はそのままに、比喩表現を使った趣深い短歌にしてください。出力の形式は以下のJSONスキーマに従ってください。各値は日本語で出力してください。
{
  "type": "object",
  "description": "変換した短歌",
  "properties": {
    "response": {
      "type": "array",
      "description": "ユーザーアカウント作成のレスポンスデータの配列",
      "items": {
        "type": "object",
        "properties": {
          "line1": {
            "type": "string",
            "description": "短歌の1行目"
          },
          "line2": {
            "type": "string",
            "description": "短歌の2行目"
          },
          "line3": {
            "type": "string",
            "description": "短歌の3行目"
          },
          "line4": {
            "type": "string",
            "description": "短歌の4行目"
          },
          "line5": {
            "type": "string",
            "description": "短歌の5行目"
          }
        },
        "required": ["line1", "line2", "line3", "line4", "line5"]
      }
    },
    "required": ["response"]
  }
}`,
      generationConfig: { responseMimeType: 'application/json' },
    });

    const result = await model.generateContent(prompt);
    const jsonResponse = JSON.parse(result.response.text());
    console.log(jsonResponse);
    console.log('-----------------------------');

    return c.json(jsonResponse);
  } catch (error) {
    console.error('APIエラー:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
};

export default generateTanka;
