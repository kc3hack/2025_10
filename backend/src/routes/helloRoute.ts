import { z } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { helloResponseSchema, helloSchema } from '../schema/helloSchema.js';

type helloSchema = z.infer<typeof helloSchema>;

const errorResponseSchema = z.object({
  message: z.string(),
  statusCode: z.number(),
  error: z.string(),
});

export const helloRoute = createRoute({
  method: 'post',
  path: '/hello',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: helloSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: helloResponseSchema,
        },
      },
      description: 'Successful response',
    },
  },
});

export type HelloRouteResponse200 = z.infer<
  (typeof helloRoute.responses)['200']['content']['application/json']['schema']
>;

export type HelloRouteResponseError = z.infer<typeof errorResponseSchema>;
