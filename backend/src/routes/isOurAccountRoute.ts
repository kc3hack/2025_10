import { z } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { isOurAccountSchema, isOurAccountResponseSchema } from '../schema/isOurAccountSchema.js';

type isOurAccountSchema = z.infer<typeof isOurAccountSchema>;

const errorResponseSchema = z.object({
  message: z.string(),
  statusCode: z.number(),
  error: z.string(),
});

export const isOurAccountRoute = createRoute({
  method: 'post',
  path: '/isOurAccount',
  tags: ['sample'],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: isOurAccountSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: isOurAccountResponseSchema,
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

export type isOurAccountRouteResponse200 = z.infer<
  (typeof isOurAccountRoute.responses)['200']['content']['application/json']['schema']
>;

export type isOurAccountRouteResponse500 = z.infer<
  (typeof isOurAccountRoute.responses)['500']['content']['application/json']['schema']
>;

export type isOurAccountRouteResponseError = z.infer<typeof errorResponseSchema>;
