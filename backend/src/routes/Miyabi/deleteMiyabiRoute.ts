import { z } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import {
  deleteMiyabiSchema,
  deleteMiyabiResponseSchema,
} from '../../schema/Miyabi/deleteMiyabiSchema.js';

type deleteMiyabiSchema = z.infer<typeof deleteMiyabiSchema>;

const errorResponseSchema = z.object({
  message: z.string(),
  statusCode: z.number(),
  error: z.string(),
});

export const deleteMiyabiRoute = createRoute({
  method: 'delete',
  path: '/miyabi',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: deleteMiyabiSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: deleteMiyabiResponseSchema,
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

export type deleteMiyabiRouteResponse200 = z.infer<
  (typeof deleteMiyabiRoute.responses)['200']['content']['application/json']['schema']
>;

export type deleteMiyabiRouteResponse404 = z.infer<
  (typeof deleteMiyabiRoute.responses)['404']['content']['application/json']['schema']
>;

export type deleteMiyabiRouteResponse500 = z.infer<
  (typeof deleteMiyabiRoute.responses)['500']['content']['application/json']['schema']
>;

export type deleteMiyabiRouteResponseError = z.infer<typeof errorResponseSchema>;
