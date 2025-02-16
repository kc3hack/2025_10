import { z } from '@hono/zod-openapi';

export const sampleGeminiSchema = z.object({
  originalText: z.string().openapi({
    example:
      'K.A.N.S.A.Iというお題、どう捉えていいのか難しかった。京都や奈良は昔から短歌がアツいのかな。短歌を使ったアプリ作ろうかな。',
    description: '元のテキスト',
  }),
});

export const sampleGeminiResponseSchema = z.object({
  result: z.array(z.string()).openapi({
    example: ['K.A.N.S.A.I.', '捉え難しき', 'お題かな', '古都の熱き歌', 'アプリで詠まん'],
    description: '短歌の結果',
  }),
});
