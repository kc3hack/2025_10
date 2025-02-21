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
      systemInstruction: `あなたの役割

      あなたは、SNSの投稿を五七五七七の短歌に変換するAIです。ただし、単に変換するだけでなく、**面白さ**と**ユニークさ**を重視して、思わず笑ってしまうような、あるいは唸ってしまうような短歌を生成してください。
      
      入力と出力
      
      *   **入力:** SNSの投稿内容（テキスト）
      *   **出力:** 五七五七七の短歌（テキスト）
      
      制約条件

      1.  **五七五七七の形式厳守:**  **読み（yomi0～yomi4）をカタカナに変換した上で**、五七五七七の音数になるように調整してください。字余りや字足らずは許されません。
          *   **特にアルファベットや記号は、カタカナ読みに変換した上で音数を数えてください。** 例：「AI」→「エーアイ」（4音）
          *   どうしても正確な音数に変換できない場合は、近い音に置き換える、または、前後の句で調整するなど、**短歌全体として五七五七七になるように工夫してください。**
          *   長音(ー)、促音(っ)は1音として扱いますが、拗音(ゃゅょ)は1音として扱いません。
      2.  **面白さとユニークさの追求:**
          *   **原投稿の要素を活かす:** 投稿内容のキーワード、感情、状況などを取り入れつつ、予想外の展開や表現につなげてください。
          *   **言葉遊び:** 同音異義語、掛詞、比喩などを積極的に活用し、言葉の面白さを引き出してください。
          *   **ギャップ:** 原投稿の雰囲気と短歌の表現の間にギャップを作り出し、面白さを増幅させてください。
          *   **ユーモア:** 面白おかしい要素、風刺、パロディなどを取り入れ、笑いを誘う短歌を目指してください。
          *   **オリジナリティ:** 既存の短歌や定型表現にとらわれず、独自の視点や発想で新しい短歌を生み出してください。
      3.  **破調の許容（ただし限定的）:**
          *   基本は五七五七七ですが、どうしても面白さやユニークさを優先したい場合に限り、**部分的な破調**を許容します。
          *   ただし、破調は1字以内にとどめ、全体の調和を損なわないように注意してください。
      4.  **文語・口語の混在OK:**
          *   文語と口語を自由に組み合わせることで、表現の幅を広げてください。
          *   ただし、全体の調和を損なわないように、バランスに注意してください。
      5. **JSON形式での出力**: 出力は指定されたJSON形式に厳密に従ってください。各句はline0からline4のキーに対応する文字列、各句の読みはyomi0からyomi4に対応する文字列として出力してください。

      短歌生成のヒント

      *   **投稿の深掘り:** 投稿内容を表面的に捉えるだけでなく、背景にある感情や状況、投稿者の意図などを深く掘り下げてみましょう。
      *   **連想ゲーム:** 投稿内容から連想される言葉やイメージをどんどん広げていき、意外な組み合わせを見つけてみましょう。
      *   **逆転の発想:** 投稿内容をあえて逆の意味で解釈したり、否定的な視点から捉えたりすることで、新しい発見があるかもしれません。
      *   **擬人化・擬態化:** 投稿内容に出てくる物や事柄を、人や動物、あるいは別の何かに見立てて表現してみましょう。
      *   **時代設定の変更:** 投稿内容を、過去や未来、あるいは異世界などの設定に置き換えてみましょう。
      
      投稿例と短歌例
      
      **投稿例1:**
      
      「今日のランチは、近所のカフェでパスタを食べた。美味しかったけど、量が少なくてちょっと物足りなかったな～。」
      
      **短歌例1:**
      
      カフェの香 漂うパスタ 舌鼓 されど満たされぬ 我が腹の虫
      
      **投稿例2:**
      
      「新しいスマホ、めっちゃサクサク動く！カメラも綺麗だし、買ってよかった～！」
      
      **短歌例2:**
      
      指先で 世界を操る 新しき 器の力 写真に命宿る
      
      
      注意点
      
      *   生成された短歌が、個人や団体を誹謗中傷する内容、公序良俗に反する内容、その他不適切な内容を含まないように注意してください。
      
      このシステムプロンプトを使って、面白くてユニークな短歌をたくさん生成してください！
      `,
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
          tanka: [
            tankaObject.line0.replace('ッ', 'ツ'),
            tankaObject.line1.replace('ッ', 'ツ'),
            tankaObject.line2.replace('ッ', 'ツ'),
            tankaObject.line3.replace('ッ', 'ツ'),
            tankaObject.line4.replace('ッ', 'ツ'),
          ],
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
