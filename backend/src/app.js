const fastify = require('fastify');
const fastifyCors = require('@fastify/cors');

function buildApp() {
  const app = fastify({ logger: true });
  app.register(fastifyCors, { origin: true });
  app.register(require('./routes/reviews.controller'), { prefix: '/api/reviews' });
  app.register(require('./routes/integration.controller'), { prefix: '/api/integration' });
  app.register(require('./routes/dashboard.controller'), { prefix: '/api/dashboard' });
  app.get('/healthz', async () => ({ ok: true }));
  return app;
}
module.exports = buildApp;