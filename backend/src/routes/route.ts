import type { OpenAPIHono } from '@hono/zod-openapi';
import { helloRoute } from './helloRoute.js';
import helloWorldHandler from '../controllers/helloHandler.js';
import { createPostRoute } from './Post/createPostRoute.js';
import createPostHandler from '../controllers/Post/createPostHandler.js';
import { deletePostRoute } from './Post/deletePostRoute.js';
import deletePostHandler from '../controllers/Post/deletePostHandler.js';

export function setupRoutes(app: OpenAPIHono) {
  app.openapi(helloRoute, helloWorldHandler);
  app.openapi(createPostRoute, createPostHandler);
  app.openapi(deletePostRoute, deletePostHandler);

  // 他のルートをここに追加
  // 例) app.openapi(helloRoute, helloWorldHandler);
}
