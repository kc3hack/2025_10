import { z } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import {
  idiconConverterSchema,
  idiconConverterResponseSchema,
} from '../schema/idiconConverterSchema.js';

type idiconConverterSchema = z.infer<typeof idiconConverterSchema>;

const errorResponseSchema = z.object({
  message: z.string(),
  statusCode: z.number(),
  error: z.string(),
});

export const idiconConverterRoute = createRoute({
  method: 'post',
  path: '/convert',
  tags: ['sample'],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: idiconConverterSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: idiconConverterResponseSchema,
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

export type idiconConverterRouteResponse200 = z.infer<
  (typeof idiconConverterRoute.responses)['200']['content']['application/json']['schema']
>;

export type idiconConverterRouteResponse500 = z.infer<
  (typeof idiconConverterRoute.responses)['500']['content']['application/json']['schema']
>;

export type idiconConverterRouteResponseError = z.infer<typeof errorResponseSchema>;
