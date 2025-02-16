import { z, type RouteHandler } from '@hono/zod-openapi';
import type { Context } from 'hono';
import { sampleDownloadSchema } from '../schema/sampleS3Schema.js';
import type { sampleS3DownloadRoute } from '../routes/sampleS3Route.js';
import { getFileByUrl } from '../lib/s3-connector.js';

type sampleDownloadSchema = z.infer<typeof sampleDownloadSchema>;

const sampleS3DownloadHandler: RouteHandler<typeof sampleS3DownloadRoute, {}> = async (
  c: Context
) => {
  const { url } = await c.req.json<sampleDownloadSchema>();

  const file = await getFileByUrl(url);

  return c.json({ file }, 200);
};

export default sampleS3DownloadHandler;
