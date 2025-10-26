const fastify = require('fastify');
const fastifyCors = require('@fastify/cors');

function buildApp() {
  const app = fastify({ logger: true });
  app.register(fastifyCors, { origin: true });
  app.register(require('./routes/reviews.controller'), { prefix: '/reviews' });
  app.register(require('./routes/integration.controller'), { prefix: '/integration' });
  app.register(require('./routes/dashboard.controller'), { prefix: '/dashboard' });
  app.get('/healthz', async () => ({ ok: true }));
  return app;
}
module.exports = buildApp;