import { z } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import {
  sampleGeminiResponseSchema,
  sampleGeminiSchema,
} from '../../schema/Sample/sampleGeminiSchema.js';
import { errorResponseSchema } from '../../middleware/errorHandler.js';

type sampleGeminiSchema = z.infer<typeof sampleGeminiSchema>;

export const sampleGeminiRoute = createRoute({
  method: 'post',
  path: '/sample/gemini',
  tags: ['sample'],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: sampleGeminiSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: sampleGeminiResponseSchema,
        },
      },
      description: 'Successful response',
    },
  },
});

export type SampleGeminiRouteResponse200 = z.infer<
  (typeof sampleGeminiRoute.responses)['200']['content']['application/json']['schema']
>;

export type SampleGeminiRouteResponseError = z.infer<typeof errorResponseSchema>;
