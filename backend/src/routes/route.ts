import { OpenAPIHono } from '@hono/zod-openapi';
import { helloRoute } from './helloRoute.js';
import helloWorldHandler from '../controllers/helloHandler.js';
import { createPostRoute } from './Post/createPostRoute.js';
import createPostHandler from '../controllers/Post/createPostHandler.js';
import { deletePostRoute } from './Post/deletePostRoute.js';
import deletePostHandler from '../controllers/Post/deletePostHandler.js';
import { getPostRoute } from './Post/getPostRoute.js';
import getPostHandler from '../controllers/Post/getPostHandler.js';

const router = new OpenAPIHono();

export default router
  .openapi(helloRoute, helloWorldHandler)
  .openapi(createPostRoute, createPostHandler)
  .openapi(deletePostRoute, deletePostHandler)
  .openapi(getPostRoute, getPostHandler);
