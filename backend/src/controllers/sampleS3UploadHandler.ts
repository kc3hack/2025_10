import { z, type RouteHandler } from '@hono/zod-openapi';
import type { Context } from 'hono';
import { sampleUploadSchema } from '../schema/sampleS3Schema.js';
import type { sampleS3UploadRoute } from '../routes/sampleS3Route.js';
import { uploadFile } from '../lib/s3-connector.js';

type sampleUploadSchema = z.infer<typeof sampleUploadSchema>;

const sampleS3UploadHandler: RouteHandler<typeof sampleS3UploadRoute, {}> = async (c: Context) => {
  const formData = await c.req.formData();
  const file = formData.get('file') as File;

  const url = await uploadFile(file);

  return c.json({ url }, 200);
};

export default sampleS3UploadHandler;
