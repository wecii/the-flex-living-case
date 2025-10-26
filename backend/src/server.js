const buildApp = require('./app');
const app = buildApp();
const PORT = process.env.PORT || 3000;
app.listen({ port: PORT, host: '0.0.0.0' })
  .then(() => app.log.info(`Server running on ${PORT}`))
  .catch(err => { app.log.error(err); process.exit(1); });