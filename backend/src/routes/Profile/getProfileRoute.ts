import { z } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import {
  getProfileSchema,
  getProfileResponseSchema,
} from '../../schema/Profile/getProfileSchema.js';

type getProfileSchema = z.infer<typeof getProfileSchema>;

const errorResponseSchema = z.object({
  message: z.string(),
  statusCode: z.number(),
  error: z.string(),
});

export const getProfileRoute = createRoute({
  method: 'post',
  path: '/profile',
  tags: ['Profile'],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: getProfileSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getProfileResponseSchema,
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

export type getProfileRouteResponse200 = z.infer<
  (typeof getProfileRoute.responses)['200']['content']['application/json']['schema']
>;

export type getProfileRouteResponse404 = z.infer<
  (typeof getProfileRoute.responses)['404']['content']['application/json']['schema']
>;

export type getProfileRouteResponse500 = z.infer<
  (typeof getProfileRoute.responses)['500']['content']['application/json']['schema']
>;

export type getProfileRouteResponseError = z.infer<typeof errorResponseSchema>;
