import { z } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import {
  getMiyabiRankingSchema,
  getMiyabiRankingResponseSchema,
} from '../../schema/Miyabi/getMiyabiRankingSchema.js';

type getMiyabiRankingSchema = z.infer<typeof getMiyabiRankingSchema>;

const errorResponseSchema = z.object({
  message: z.string(),
  statusCode: z.number(),
  error: z.string(),
});

export const getMiyabiRankingRoute = createRoute({
  method: 'post',
  path: '/miyabiranking',
  tags: ['MiyabiRanking'],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: getMiyabiRankingSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getMiyabiRankingResponseSchema,
        },
      },
      description: 'Successful response',
    },
    500: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description: 'Internal Server Error response',
    },
  },
});

export type getMiyabiRankingRouteResponse200 = z.infer<
  (typeof getMiyabiRankingRoute.responses)['200']['content']['application/json']['schema']
>;

export type getMiyabiRankingRouteResponse500 = z.infer<
  (typeof getMiyabiRankingRoute.responses)['500']['content']['application/json']['schema']
>;

export type getPostRouteResponseError = z.infer<typeof errorResponseSchema>;
