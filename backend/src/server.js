const buildApp = require('./app');
const app = buildApp();

if (process.env.VERCEL === '1' || process.env.VERCEL === 'true') {
  // Vercel: export the app for serverless
  module.exports = app;
} else {
  // Local: listen on port
  const PORT = process.env.PORT || 3000;
  app.listen({ port: PORT, host: '0.0.0.0' })
    .then(() => app.log.info(`Server running on ${PORT}`))
    .catch(err => { app.log.error(err); process.exit(1); });
}