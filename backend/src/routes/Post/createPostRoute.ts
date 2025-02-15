import { z } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { createPostSchema, createPostResponseSchema } from '../../schema/Post/createPostSchema.js';

type createPostSchema = z.infer<typeof createPostSchema>;

const errorResponseSchema = z.object({
  message: z.string(),
  statusCode: z.number(),
  error: z.string(),
});

export const createPostRoute = createRoute({
  method: 'post',
  path: '/post',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: createPostSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: createPostResponseSchema,
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

export type createPostRouteResponse200 = z.infer<
  (typeof createPostRoute.responses)['200']['content']['application/json']['schema']
>;

export type createPostRouteResponse500 = z.infer<
  (typeof createPostRoute.responses)['500']['content']['application/json']['schema']
>;

export type createPostRouteResponseError = z.infer<typeof errorResponseSchema>;
