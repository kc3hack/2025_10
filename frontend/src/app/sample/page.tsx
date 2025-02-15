import React from 'react';
import { hc } from 'hono/client';
import { AppType } from '../../../../backend/src/index';
import Link from 'next/link';

// サンプルデータの型
interface SampleData {
  message: string;
  id: number;
  password: string;
}

const client = hc<AppType>('http://localhost:8080');

// サンプルデータを取得する関数
const postSampleData = async (): Promise<SampleData | null> => {
  try {
    const res = await client.hello.$post({
      json: {
        id: 1,
        password: 'password',
      },
    });

    // エラーがある場合はnullを返す
    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

const page = async (): Promise<React.ReactNode> => {
  const data = await postSampleData(); // サンプルデータを取得

  console.log(data);

  return (
    <main>
      <h1>PostSample</h1>
      <p>{data?.message}</p>
      <p>{data?.id}</p>
      <p>{data?.password}</p>
      <Link href='/'>Home</Link>
    </main>
  );
};

export default page;
