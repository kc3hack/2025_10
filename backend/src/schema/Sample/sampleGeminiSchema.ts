import { z } from '@hono/zod-openapi';

export const sampleGeminiSchema = z.object({
  originalText: z.string().openapi({
    example:
      'K.A.N.S.A.Iというお題、どう捉えていいのか難しかった。京都や奈良は昔から短歌がアツいのかな。短歌を使ったアプリ作ろうかな。',
    description: '元のテキスト',
  }),
});

export const sampleGeminiResponseSchema = z.object({
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
        line0: 'K.A.N.S.A.I.',
        line1: '捉え難しき',
        line2: 'お題かな',
        line3: '古都の熱き歌',
        line4: 'アプリで詠まん',
      },
      description: '短歌の結果',
    }),
});
