import { z } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { createUserSchema, createUserResponseSchema } from '../../schema/User/createUserSchema.js';

type createUserSchema = z.infer<typeof createUserSchema>;

const errorResponseSchema = z.object({
  message: z.string(),
  statusCode: z.number(),
  error: z.string(),
});

export const createUserRoute = createRoute({
  method: 'post',
  path: '/user',
  tags: ['User'],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: createUserSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: createUserResponseSchema,
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

export type createUserRouteResponse200 = z.infer<
  (typeof createUserRoute.responses)['200']['content']['application/json']['schema']
>;

export type createUserRouteResponse500 = z.infer<
  (typeof createUserRoute.responses)['500']['content']['application/json']['schema']
>;

export type createMiyabiRouteResponseError = z.infer<typeof errorResponseSchema>;
