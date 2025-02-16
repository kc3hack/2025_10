import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { env } from './config/env.js';
import router from './routes/route.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = new OpenAPIHono().route('/', router);

// CORS設定
const frontendUrl = env.FRONTEND_URL;
app.use(
  cors({
    origin: frontendUrl,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Type', 'Authorization'],
  })
);

app.doc('/docs/json', {
  openapi: '3.1.0',
  info: {
    title: 'Tankalizer API',
    version: '1.0.0',
    description: 'Tankalizer API description',
  },
});

// Swagger UI
app.get(
  '/docs',
  swaggerUI({
    url: '/docs/json',
  })
);

app.onError(errorHandler);

const port = env.PORT || 8080;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});

export type AppType = typeof app;
