import { OpenAPIHono } from '@hono/zod-openapi';
import { helloRoute } from './helloRoute.js';
import helloWorldHandler from '../controllers/helloHandler.js';
import { sampleS3UploadRoute } from './sampleS3Route.js';
import sampleS3UploadHandler from '../controllers/sampleS3UploadHandler.js';
import { sampleS3DownloadRoute } from './sampleS3Route.js';
import sampleS3DownloadHandler from '../controllers/sampleS3DownloadHandler.js';

const router = new OpenAPIHono();

export default router
  .openapi(helloRoute, helloWorldHandler)
  .openapi(sampleS3UploadRoute, sampleS3UploadHandler)
  .openapi(sampleS3DownloadRoute, sampleS3DownloadHandler);
// .openapi(helloRoute, helloWorldHandler); //こういう感じで足していく
