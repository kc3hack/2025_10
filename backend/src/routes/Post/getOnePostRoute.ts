import { z } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { getOnePostSchema, getOnePostResponseSchema } from '../../schema/Post/getOnePostSchema.js';

type getOnePostSchema = z.infer<typeof getOnePostSchema>;

const errorResponseSchema = z.object({
  message: z.string(),
  statusCode: z.number(),
  error: z.string(),
});

export const getOnePostRoute = createRoute({
  method: 'post',
  path: '/share',
  tags: ['Post'],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: getOnePostSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getOnePostResponseSchema,
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

export type getOnePostRouteResponse200 = z.infer<
  (typeof getOnePostRoute.responses)['200']['content']['application/json']['schema']
>;

export type getOnePostRouteResponse404 = z.infer<
  (typeof getOnePostRoute.responses)['404']['content']['application/json']['schema']
>;

export type getOnePostRouteResponse500 = z.infer<
  (typeof getOnePostRoute.responses)['500']['content']['application/json']['schema']
>;

export type getOnePostRouteResponseError = z.infer<typeof errorResponseSchema>;
