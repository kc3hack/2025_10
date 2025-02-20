import type { Context } from 'hono';
import { env } from '../config/env.js';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const printLine = (): void => {
  console.log('--------------------------------');
};

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

    const schema = {
      description: '生成される短歌のオブジェクト',
      type: SchemaType.OBJECT,
      properties: {
        line0: {
          type: SchemaType.STRING,
          description: '短歌の1句目, 日本語で5音節程度',
          nullable: false,
        },
        line1: {
          type: SchemaType.STRING,
          description: '短歌の2句目, 日本語で7音節程度',
          nullable: false,
        },
        line2: {
          type: SchemaType.STRING,
          description: '短歌の3句目, 日本語で5音節程度',
          nullable: false,
        },
        line3: {
          type: SchemaType.STRING,
          description: '短歌の4句目, 日本語で7音節程度',
          nullable: false,
        },
        line4: {
          type: SchemaType.STRING,
          description: '短歌の5句目, 日本語で7音節程度',
          nullable: false,
        },
        yomi0: {
          type: SchemaType.STRING,
          description: '短歌の1句目のふりがな',
          nullable: false,
        },
        yomi1: {
          type: SchemaType.STRING,
          description: '短歌の2句目のふりがな',
          nullable: false,
        },
        yomi2: {
          type: SchemaType.STRING,
          description: '短歌の3句目のふりがな',
          nullable: false,
        },
        yomi3: {
          type: SchemaType.STRING,
          description: '短歌の4句目のふりがな',
          nullable: false,
        },
        yomi4: {
          type: SchemaType.STRING,
          description: '短歌の5句目のふりがな',
          nullable: false,
        },
      },
      required: [
        'line0',
        'line1',
        'line2',
        'line3',
        'line4',
        'yomi0',
        'yomi1',
        'yomi2',
        'yomi3',
        'yomi4',
      ],
    };

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction:
        'SNSの投稿を短歌にしてください。原文の特徴的な要素はそのままに、比喩表現を使った趣深い短歌にしてください。出力の形式は指定したJSONスキーマに従ってください。各値は日本語で出力してください。',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });

    // 短歌の各句の文字数をチェックする関数
    const isValidTanka = (tanka: string[], tankaYomi: string[]): boolean => {
      // tankaに「（）()」があれば短歌とふりがなを一緒に出力したと判定して失敗判定
      if (
        tanka.includes('（') ||
        tanka.includes('）') ||
        tanka.includes('(') ||
        tanka.includes(')')
      ) {
        return false;
      }

      const expectedCharaCount = [5, 7, 5, 7, 7];
      return tankaYomi.every((line, index) => {
        // everyは配列のすべての要素が条件を満たしていればtrueを返す
        console.log(line);
        // アルファベット（全角、半角）、ひらがな、カタカナ、漢字を1文字としてカウント
        const regex = /[A-Za-z\uFF21-\uFF3A\uFF41-\uFF5A\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/g;
        const matchedChars = line.match(regex) || [];
        // console.log(matchedChars);
        // 「ゃ」「ャ」「ゅ」「ュ」「ょ」「ョ」はカウントしない
        const excludeChars = ['ゃ', 'ャ', 'ゅ', 'ュ', 'ょ', 'ョ'];
        const validChars = matchedChars.filter((char) => !excludeChars.includes(char));
        const count = validChars.length;
        // console.log('count: ', count);

        // 文字数をカウント（アルファベット（全角、半角）、ひらがな、カタカナ、漢字を1文字としてカウント）
        return Math.abs(count - expectedCharaCount[index]) <= 1; // 1文字分までの誤差は許容
      });
    };

    // 生成後、型のチェック（3回まで）
    for (let i = 0; i < 3; i++) {
      printLine();
      console.log(`短歌生成${i + 1}回目`);

      const result = await model.generateContent(originalText);

      // console.log(result.response.text());

      const jsonResponse = JSON.parse(result.response.text());

      console.log(jsonResponse);

      const tanka = [
        jsonResponse.line0.replace('ッ', 'ツ'),
        jsonResponse.line1.replace('ッ', 'ツ'),
        jsonResponse.line2.replace('ッ', 'ツ'),
        jsonResponse.line3.replace('ッ', 'ツ'),
        jsonResponse.line4.replace('ッ', 'ツ'),
      ];

      const tankaYomi = [
        jsonResponse.yomi0,
        jsonResponse.yomi1,
        jsonResponse.yomi2,
        jsonResponse.yomi3,
        jsonResponse.yomi4,
      ];

      // console.log(tanka);

      if (isValidTanka(tanka, tankaYomi)) {
        printLine();
        console.log('短歌の形式が正しいので結果を返却');
        // ["短歌の1行目", "短歌の2行目", "短歌の3行目", "短歌の4行目", "短歌の5行目"]
        return tanka;
      } else if (i < 2) {
        printLine();
        console.log(tanka);
        console.log(tankaYomi);
        console.log('短歌の形式が不正のため再生成');
      }
    }

    printLine();
    console.log('短歌を生成できませんでした');
    throw new Error('短歌を生成できませんでした');
  } catch (error) {
    console.error('APIエラー:', error);
    return [];
  }
};

const getNews = async (originalText: string): Promise<JSON> => {
  try {
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('APIが設定されていません。');
    }
  } catch (error) {
    console.error('APIエラー:', error);
    return {};
  }
};

export default generateTanka;
