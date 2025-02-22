import { z } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import {
  sampleNewsTankaResponseSchema,
  sampleNewsTankaSchema,
} from '../../schema/Sample/sampleNewsTankaSchema.js';
import { errorResponseSchema } from '../../middleware/errorHandler.js';

type sampleNewsTankaSchema = z.infer<typeof sampleNewsTankaSchema>;

export const sampleNewsTankaRoute = createRoute({
  method: 'post',
  path: '/sample/news',
  tags: ['sample'],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: sampleNewsTankaSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: sampleNewsTankaResponseSchema,
        },
      },
      description: 'Successful response',
    },
  },
});

export type SampleNewsTankaRouteResponse200 = z.infer<
  (typeof sampleNewsTankaRoute.responses)['200']['content']['application/json']['schema']
>;

export type SampleNewsTankaRouteResponseError = z.infer<typeof errorResponseSchema>;
