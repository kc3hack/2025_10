import { z } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import {
  createMiyabiSchema,
  createMiyabiResponseSchema,
} from '../../schema/Miyabi/createMiyabiSchema.js';

type createMiyabiSchema = z.infer<typeof createMiyabiSchema>;

const errorResponseSchema = z.object({
  message: z.string(),
  statusCode: z.number(),
  error: z.string(),
});

export const createMiyabiRoute = createRoute({
  method: 'post',
  path: '/miyabi',
  tags: ['Miyabi'],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: createMiyabiSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: createMiyabiResponseSchema,
        },
      },
      description: 'Successful response',
    },
    404: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description: 'Not Found',
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

export type createMiyabiRouteResponse200 = z.infer<
  (typeof createMiyabiRoute.responses)['200']['content']['application/json']['schema']
>;

export type createMiyabiRouteResponse404 = z.infer<
  (typeof createMiyabiRoute.responses)['404']['content']['application/json']['schema']
>;

export type createMiyabiRouteResponse500 = z.infer<
  (typeof createMiyabiRoute.responses)['500']['content']['application/json']['schema']
>;

export type createMiyabiRouteResponseError = z.infer<typeof errorResponseSchema>;
