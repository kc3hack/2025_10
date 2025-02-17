/* --- AWS S3と接続するよ --- */

import { env } from '../config/env.js';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

import { generateUuid } from '../utils/generate-uuid.js';

const s3Client = new S3Client({
  region: 'ap-northeast-1',
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
});

/**
 * ファイルをS3にアップロードする
 * @param file アップロードするファイル
 * @returns アップロードされたファイルのURL
 */
export const uploadFile = async (file: File): Promise<string> => {
  try {
    // 画像かどうかチェック
    if (!isImage(file)) {
      throw new Error('Invalid file type');
    }

    // 今日の日付でディレクトリを生成
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const directory = `${year}-${month}-${day}`;

    // uuid生成
    const uuid = generateUuid();
    const fileName = `${directory}/${uuid}.${file.type.split('/')[1]}`;

    // FileをBufferに変換
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // S3にアップロード
    const command = new PutObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    const resultUrl = `https://${env.S3_BUCKET_NAME}.s3.ap-northeast-1.amazonaws.com/${fileName}`;

    return resultUrl;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * URLからファイルを取得する
 * @param url ファイルのURL
 * @returns ファイルのバッファ
 */
export const getFileByUrl = async (url: string): Promise<Buffer> => {
  const filePath = url.replace(
    `https://${env.S3_BUCKET_NAME}.s3.ap-northeast-1.amazonaws.com/`,
    ''
  );

  try {
    const command = new GetObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: filePath,
    });

    const result = await s3Client.send(command);

    const stream = result.Body;

    if (!stream) {
      throw new Error('ファイルが見つかりません');
    }

    const buffer = await streamToBuffer(stream);

    return buffer;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const isImage = (file: File): boolean => {
  return file.type.startsWith('image/');
};

const streamToBuffer = (stream: any): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on('data', (chunk: Uint8Array) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
};
