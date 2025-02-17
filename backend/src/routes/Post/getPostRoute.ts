import { z } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { getPostSchema, getPostResponseSchema } from '../../schema/Post/getPostSchema.js';

type getPostSchema = z.infer<typeof getPostSchema>;

const errorResponseSchema = z.object({
  message: z.string(),
  statusCode: z.number(),
  error: z.string(),
});

export const getPostRoute = createRoute({
  method: 'post',
  path: '/timeline',
  tags: ['Post'],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: getPostSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getPostResponseSchema,
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

export type getPostRouteResponse200 = z.infer<
  (typeof getPostRoute.responses)['200']['content']['application/json']['schema']
>;

export type getPostRouteResponse404 = z.infer<
  (typeof getPostRoute.responses)['404']['content']['application/json']['schema']
>;

export type getPostRouteResponse500 = z.infer<
  (typeof getPostRoute.responses)['500']['content']['application/json']['schema']
>;

export type getPostRouteResponseError = z.infer<typeof errorResponseSchema>;
