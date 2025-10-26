const db = require('../config/db');

async function getDashboardStats() {
	// Total review count
	const totalReviewsRes = await db.query('SELECT COUNT(*) as count FROM reviews');
	const totalReviews = Number(totalReviewsRes.rows[0].count);

	// Approved review count
	const approvedReviewsRes = await db.query('SELECT COUNT(*) as count FROM reviews WHERE review_status = "approved"');
	const approvedReviews = Number(approvedReviewsRes.rows[0].count);

	// Distinct property_name count
	const propertyNamesRes = await db.query('SELECT COUNT(DISTINCT property_name) as count FROM reviews');
	const propertyCount = Number(propertyNamesRes.rows[0].count);

	// Average reviews per property
	const avgReviewsPerPropertyRes = await db.query('SELECT AVG(cnt) as avg FROM (SELECT COUNT(*) as cnt FROM reviews GROUP BY property_name)');
	const avgReviewsPerProperty = Number(avgReviewsPerPropertyRes.rows[0].avg || 0);

	// Average review rating
	const avgRatingRes = await db.query('SELECT AVG(rating) as avg FROM reviews');
	const avgRating = Number(avgRatingRes.rows[0].avg || 0);

	// Average category scores (direct columns)
	const avgCleanlinessRes = await db.query('SELECT AVG(cleanliness) as avg FROM reviews WHERE cleanliness IS NOT NULL');
	const avgCleanliness = Number(avgCleanlinessRes.rows[0].avg || 0);

	const avgCommunicationRes = await db.query('SELECT AVG(communication) as avg FROM reviews WHERE communication IS NOT NULL');
	const avgCommunication = Number(avgCommunicationRes.rows[0].avg || 0);

	const avgRespectRes = await db.query('SELECT AVG(respect_house_rules) as avg FROM reviews WHERE respect_house_rules IS NOT NULL');
	const avgRespect = Number(avgRespectRes.rows[0].avg || 0);

	return {
		totalReviews,
		approvedReviews,
		propertyCount,
		avgReviewsPerProperty,
		avgRating,
		avgCleanliness,
		avgCommunication,
		avgRespect
	};
}

module.exports = { getDashboardStats };
