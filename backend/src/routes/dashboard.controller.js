const dashboardService = require('../services/dashboard.service');
module.exports = async function (app) {
	app.get('/stats', async (req, res) => {
		const stats = await dashboardService.getDashboardStats();
		return stats;
	});
};
