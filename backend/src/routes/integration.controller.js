const hostawayService = require('../services/hostaway.service');
module.exports = async function (app) {
  app.get('/hostaway', async (req) => hostawayService.integrate());
};