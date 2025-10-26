function buildLimitOffset(page = 1, pageSize = 25) {
  const limit = Math.max(1, Math.min(100, Number(pageSize)));
  const offset = (Math.max(1, Number(page)) - 1) * limit;
  return { limit, offset };
}
module.exports = { buildLimitOffset };