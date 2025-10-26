function toInternalReview(h) {
  const rating = h.rating === null ? 0 : Number(h.rating);
  const category = {};
  if (Array.isArray(h.reviewCategory)) h.reviewCategory.forEach(c => category[c.category] = Number(c.rating));
  return { 
    source: 'hostaway',
    review_type: h.type || null,
    external_id: String(h.id), 
    guest_name: h.guestName, 
    rating,
    comment: h.publicReview, 
    category_scores: category, 
    submitted_at: h.submittedAt, 
    listing_name: h.listingName || null,
    review_status: 'pending'
  };
}
module.exports = { toInternalReview };