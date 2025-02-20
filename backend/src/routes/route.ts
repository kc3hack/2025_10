import { OpenAPIHono } from '@hono/zod-openapi';
import { helloRoute } from './helloRoute.js';
import helloWorldHandler from '../controllers/helloHandler.js';
import { createPostRoute } from './Post/createPostRoute.js';
import createPostHandler from '../controllers/Post/createPostHandler.js';
import { deletePostRoute } from './Post/deletePostRoute.js';
import deletePostHandler from '../controllers/Post/deletePostHandler.js';
import { getPostRoute } from './Post/getPostRoute.js';
import getPostHandler from '../controllers/Post/getPostHandler.js';
import { createMiyabiRoute } from './Miyabi/createMiyabiRoute.js';
import createMiyabiHandler from '../controllers/Miyabi/createMiyabiHandler.js';
import { deleteMiyabiRoute } from './Miyabi/deleteMiyabiRoute.js';
import deleteMiyabiHandler from '../controllers/Miyabi/deleteMiyabiHandler.js';
import { createUserRoute } from './User/createUserRoute.js';
import createUserHandler from '../controllers/User/createUserHandler.js';
import { getProfileRoute } from './Profile/getProfileRoute.js';
import getProfileHandler from '../controllers/Profile/getProfileHandler.js';
import { sampleS3UploadRoute } from './sampleS3Route.js';
import sampleS3UploadHandler from '../controllers/sampleS3UploadHandler.js';
import { sampleS3DownloadRoute } from './sampleS3Route.js';
import sampleS3DownloadHandler from '../controllers/sampleS3DownloadHandler.js';
import { sampleGeminiRoute } from './Sample/sampleGeminiRoute.js';
import sampleGeminiHandler from '../controllers/Sample/sampleGeminiHandler.js';

const router = new OpenAPIHono();

export default router
  .openapi(helloRoute, helloWorldHandler)
  .openapi(createPostRoute, createPostHandler)
  .openapi(deletePostRoute, deletePostHandler)
  .openapi(getPostRoute, getPostHandler)
  .openapi(createMiyabiRoute, createMiyabiHandler)
  .openapi(deleteMiyabiRoute, deleteMiyabiHandler)
  .openapi(createUserRoute, createUserHandler)
  .openapi(getProfileRoute, getProfileHandler)
  .openapi(sampleS3UploadRoute, sampleS3UploadHandler)
  .openapi(sampleS3DownloadRoute, sampleS3DownloadHandler)
  .openapi(sampleGeminiRoute, sampleGeminiHandler);
// .openapi(helloRoute, helloWorldHandler); //こういう感じで足していく
