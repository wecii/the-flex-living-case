const db = require('../config/db');
const { buildLimitOffset } = require('../utils/pagination');
async function findMany(filters = {}) {
  const where = []; const params = [];
  if (filters.property_name) { where.push(`property_name = ?`); params.push(filters.property_name); }
  if (filters.status) { where.push(`review_status = ?`); params.push(filters.status); }
  if (filters.source) { where.push(`source = ?`); params.push(filters.source); }
  if (filters.ratingMin) { where.push(`rating >= ?`); params.push(filters.ratingMin); }
  if (filters.ratingMax) { where.push(`rating <= ?`); params.push(filters.ratingMax); }
  if (filters.dateFrom) { where.push(`submitted_at >= ?`); params.push(filters.dateFrom); }
  if (filters.dateTo) { where.push(`submitted_at <= ?`); params.push(filters.dateTo); }
  const page = filters.page || 1;
  const pageSize = filters.pageSize || 25;
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const { limit, offset } = buildLimitOffset(page, pageSize);
  const totalRes = await db.query(`SELECT COUNT(*) as count FROM reviews ${whereSql}`, params);
  const itemsRes = await db.query(
    `SELECT * FROM reviews ${whereSql} ORDER BY submitted_at DESC LIMIT ${limit} OFFSET ${offset}`, params);
  return { total: Number(totalRes.rows[0].count), page, pageSize, items: itemsRes.rows };
}
async function findById(id) { const { rows } = await db.query('SELECT * FROM reviews WHERE id=?', [id]); return rows[0]; }
async function approveById(id) { await db.query('UPDATE reviews SET review_status="approved", approved_at=datetime("now") WHERE id=?', [id]); }
async function findApprovedByPropertySlug({ propertySlug, limit = 10 }) {
  let sql = `SELECT r.* FROM reviews r JOIN properties p ON p.id = r.property_id WHERE r.status='approved'`;
  const params = [];
  if (propertySlug) {
    sql += ' AND p.slug=?';
    params.push(propertySlug);
  }
  sql += ' ORDER BY r.submitted_at DESC LIMIT ?';
  params.push(limit);
  const { rows } = await db.query(sql, params);
  return rows;
}
async function insertBulkHostawayReviews(reviews) {
  console.log(reviews[0])
  const placeholders = reviews.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ');
  const sql = `INSERT INTO reviews (
    property_name, review_type, source, external_id, guest_name, rating, comment, cleanliness, communication, respect_house_rules, submitted_at, review_status, approved_at
  ) VALUES ${placeholders}`;
  const params = [];
  for (const review of reviews) {
    params.push(
      review.listing_name || null,
      review.review_type || null,
      review.source || null,
      review.external_id || null,
      review.guest_name || null,
      review.rating || null,
      review.comment || null,
      review.category_scores?.cleanliness ?? null,
      review.category_scores?.communication ?? null,
      review.category_scores?.respect_house_rules ?? null,
      review.submitted_at || null,
      review.review_status || 'pending',
      review.approved_at || null
    );
  }
  await db.query(sql, params);
}
module.exports = { findMany, findById, approveById, findApprovedByPropertySlug, insertBulkHostawayReviews };