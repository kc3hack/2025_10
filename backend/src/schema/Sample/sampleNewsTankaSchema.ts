import { z } from '@hono/zod-openapi';

export const sampleNewsTankaSchema = z.object({
  apiKey: z.string().openapi({
    example: 'abc123',
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
        line0: '巷説の',
        line1: '風の便りと',
        line2: '聞きなして',
        line3: '都の噂を',
        line4: '語り継がんか',
      },
      description: 'ニュースを取得し、短歌にした結果',
    }),
});
