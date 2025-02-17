import { z } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { deletePostSchema, deletePostResponseSchema } from '../../schema/Post/deletePostSchema.js';

type deletePostSchema = z.infer<typeof deletePostSchema>;

const errorResponseSchema = z.object({
  message: z.string(),
  statusCode: z.number(),
  error: z.string(),
});

export const deletePostRoute = createRoute({
  method: 'delete',
  path: '/post',
  tags: ['Post'],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: deletePostSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: deletePostResponseSchema,
        },
      },
      description: 'Successful response',
    },
    403: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description: 'Forbidden',
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

export type deletePostRouteResponse200 = z.infer<
  (typeof deletePostRoute.responses)['200']['content']['application/json']['schema']
>;

export type deletePostRouteResponse403 = z.infer<
  (typeof deletePostRoute.responses)['403']['content']['application/json']['schema']
>;

export type deletePostRouteResponse404 = z.infer<
  (typeof deletePostRoute.responses)['404']['content']['application/json']['schema']
>;

export type deletePostRouteResponse500 = z.infer<
  (typeof deletePostRoute.responses)['500']['content']['application/json']['schema']
>;

export type deletePostRouteResponseError = z.infer<typeof errorResponseSchema>;
