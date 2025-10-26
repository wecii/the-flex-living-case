// api/index.js
const buildApp = require('../src/app'); // app.js içinde fastify instance kuruyorsun
const app = buildApp();

module.exports = async (req, res) => {
  await app.ready();
  app.server.emit('request', req, res);
};