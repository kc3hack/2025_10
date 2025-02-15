import type { OpenAPIHono } from '@hono/zod-openapi';
import { helloRoute } from './helloRoute.js';
import helloWorldHandler from '../controllers/helloHandler.js';

export function setupRoutes(app: OpenAPIHono) {
  app.openapi(helloRoute, helloWorldHandler);

  // 他のルートをここに追加
  // 例) app.openapi(helloRoute, helloWorldHandler);
}
