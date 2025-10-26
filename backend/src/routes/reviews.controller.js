const reviewsService = require('../services/reviews.service');
const hostawayService = require('../services/hostaway.service');
module.exports = async function (app) {
  app.get('/', async (req) => reviewsService.list(req.query || {}));
  app.post('/:id/approve', async (req, reply) => {
    await reviewsService.approve(req.params.id);
    reply.send({ ok: true });
  });
  app.get('/:id', async (req, reply) => {
    const review = await reviewsService.getById(req.params.id);
    if (!review) return reply.code(404).send({ error: 'not_found', data: null });
    reply.send({error: null, data: review});
  });
};