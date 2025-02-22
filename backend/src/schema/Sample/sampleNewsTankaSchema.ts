import { z } from '@hono/zod-openapi';

export const sampleNewsTankaSchema = z.object({
  apiKey: z.string().openapi({
    example: 'abc123...',
    description: 'APIキー',
  }),
});

export const sampleNewsTankaResponseSchema = z.object({
  isSuccess: z.boolean().openapi({
    example: true,
    description: '短歌の生成に成功したかどうか',
  }),
  tanka: z
    .object({
      line0: z.string(),
      line1: z.string(),
      line2: z.string(),
      line3: z.string(),
      line4: z.string(),
    })
    .openapi({
      example: {
        line0: 'ニュースです',
        line1: 'これはニュースよ',
        line2: 'ニュースです',
        line3: 'リアルタイムの',
        line4: 'ニュースですわよ',
      },
      description: 'ニュースを取得し、短歌にした結果',
    }),
});
