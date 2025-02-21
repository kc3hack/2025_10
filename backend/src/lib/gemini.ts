import type { Context } from 'hono';
import { env } from '../config/env.js';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const printLine = (): void => {
  console.log('--------------------------------');
};

const generateTanka = async (originalText: string): Promise<any> => {
  // Geminiで短歌生成

  try {
    if (!originalText) {
      throw new Error('原文が指定されていません。');
    }

    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('API キーが設定されていません。');
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
    const isValidTanka = (tankaObject: any): boolean => {
      const lines = [
        tankaObject.line0,
        tankaObject.line1,
        tankaObject.line2,
        tankaObject.line3,
        tankaObject.line4,
      ];

      const yomis = [
        tankaObject.yomi0,
        tankaObject.yomi1,
        tankaObject.yomi2,
        tankaObject.yomi3,
        tankaObject.yomi4,
      ];

      // lineに「（）()」があれば短歌とふりがなを一緒に出力したと判定して失敗判定
      if (
        lines.some(
          (line) =>
            line.includes('（') || line.includes('）') || line.includes('(') || line.includes(')')
        )
      ) {
        console.log('括弧付き読み仮名を出力したとして失敗判定');
        return false;
      }

      const expectedSyllable = [5, 7, 5, 7, 7];
      return yomis.every((yomi, index) => {
        // アルファベット（半角）、ひらがな（\u3040-\u309F）、カタカナ（\u30A0-\u30FF）を1文字としてカウント
        const regex = /[A-Za-z\u3040-\u309F\u30A0-\u30FF]/g;
        const matchedChars = yomi.match(regex) || [];
        // 「ゃ」「ャ」「ゅ」「ュ」「ょ」「ョ」はカウントしない
        const excludeChars = ['ゃ', 'ャ', 'ゅ', 'ュ', 'ょ', 'ョ'];
        const validChars = matchedChars.filter((char: string) => !excludeChars.includes(char));
        const syllable = validChars.length;
        console.log(`${index + 1}句目: ${syllable}音`);

        // 文字数をカウント（アルファベット（全角、半角）、ひらがな、カタカナ、漢字を1文字としてカウント）
        return Math.abs(syllable - expectedSyllable[index]) <= 1; // 1文字分までの誤差は許容
      });
    };

    // 生成後、型のチェック（3回まで）
    for (let i = 0; i < 3; i++) {
      printLine();
      console.log(`短歌生成${i + 1}回目`);

      let result;
      try {
        result = await model.generateContent(originalText);
      } catch (error: any) {
        console.error(error);

        if (error.message.includes('[429 Too Many Requests]')) {
          throw new Error('Gemini API のリクエスト数が上限に達しました。');
        }
        throw new Error('Gemini API でエラーが発生しました。');
      }

      const tankaObject = JSON.parse(result.response.text());
      console.log(tankaObject);

      if (isValidTanka(tankaObject)) {
        printLine();
        console.log('短歌の形式が正しいので結果を返す');
        return {
          isSuccess: true,
          tanka: {
            line0: tankaObject.line0.replace('ッ', 'ツ'),
            line1: tankaObject.line1.replace('ッ', 'ツ'),
            line2: tankaObject.line2.replace('ッ', 'ツ'),
            line3: tankaObject.line3.replace('ッ', 'ツ'),
            line4: tankaObject.line4.replace('ッ', 'ツ'),
          },
        };
      } else if (i < 2) {
        printLine();
        console.log('短歌の形式が不正のため再生成');
      } else {
        // 3回生成しても短歌の形式が不正だった場合
        printLine();
        throw new Error('短歌の生成に失敗しました。');
      }
    }
  } catch (error: any) {
    console.error(error);
    return {
      isSuccess: false,
      message: error.message,
    };
  }
};

export default generateTanka;
