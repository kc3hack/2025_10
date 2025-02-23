import { z } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { newsTankaResponseSchema, newsTankaSchema } from '../../schema/News/newsTankaSchema.js';
import { errorResponseSchema } from '../../middleware/errorHandler.js';

type newsTankaSchema = z.infer<typeof newsTankaSchema>;

export const newsTankaRoute = createRoute({
  method: 'post',
  path: '/news',
  tags: ['news'],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: newsTankaSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: newsTankaResponseSchema,
        },
      },
      description: 'Successful response',
    },
  },
});

export type NewsTankaRouteResponse200 = z.infer<
  (typeof newsTankaRoute.responses)['200']['content']['application/json']['schema']
>;

export type NewsTankaRouteResponseError = z.infer<typeof errorResponseSchema>;
