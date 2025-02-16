import { z } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { errorResponseSchema } from '../middleware/errorHandler.js';
import {
  sampleUploadSchema,
  sampleUploadResponseSchema,
  sampleDownloadSchema,
  sampleDownloadResponseSchema,
} from '../schema/sampleS3Schema.js';
type sampleUploadSchema = z.infer<typeof sampleUploadSchema>;

export const sampleS3UploadRoute = createRoute({
  method: 'post',
  path: '/s3/upload',
  request: {
    body: {
      required: true,
      content: {
        'multipart/form-data': {
          schema: sampleUploadSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: sampleUploadResponseSchema,
        },
      },
      description: 'Successful response',
    },
  },
});

type sampleDownloadSchema = z.infer<typeof sampleDownloadSchema>;

export const sampleS3DownloadRoute = createRoute({
  method: 'post',
  path: '/s3/download',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: sampleDownloadSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: sampleDownloadResponseSchema,
        },
      },
      description: 'Successful response',
    },
  },
});

export type SampleS3UploadRouteResponse200 = z.infer<
  (typeof sampleS3UploadRoute.responses)['200']['content']['application/json']['schema']
>;

export type SampleS3UploadRouteResponseError = z.infer<typeof errorResponseSchema>;

export type SampleS3DownloadRouteResponse200 = z.infer<
  (typeof sampleS3DownloadRoute.responses)['200']['content']['application/json']['schema']
>;

export type SampleS3DownloadRouteResponseError = z.infer<typeof errorResponseSchema>;
