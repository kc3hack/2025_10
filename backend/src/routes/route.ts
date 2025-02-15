import { OpenAPIHono } from '@hono/zod-openapi';
import { helloRoute } from './helloRoute.js';
import helloWorldHandler from '../controllers/helloHandler.js';

const router = new OpenAPIHono();

export default router.openapi(helloRoute, helloWorldHandler);
// .openapi(helloRoute, helloWorldHandler); //こういう感じで足していく
