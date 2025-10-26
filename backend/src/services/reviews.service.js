const repo = require('../repos/reviews.repo');
const hostawayService = require('./hostaway.service');
const STATUS = { PENDING: 'pending', APPROVED: 'approved', REJECTED: 'rejected' };
async function list(filters) { 
  const reviews = await repo.findMany(filters); 
  return reviews;
}
async function approve(id) {
  const review = await repo.findById(id);
  if (!review) throw new Error('not_found');
  if (review.review_status === STATUS.APPROVED) return;
  if (review.review_status !== STATUS.PENDING) throw new Error('invalid_state');
  await repo.approveById(id);
}
async function listApprovedPublic({ propertySlug, limit = 10 }) {
  return repo.findApprovedByPropertySlug({ propertySlug, limit });
}
async function getById(id) {
  return await repo.findById(id);
}
module.exports = { list, approve, listApprovedPublic, getById };