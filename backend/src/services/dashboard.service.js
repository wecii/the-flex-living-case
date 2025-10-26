const dashboardRepo = require('../repos/dashboard.repo');

async function getDashboardStats() {
  return dashboardRepo.getDashboardStats();
}

module.exports = { getDashboardStats };
