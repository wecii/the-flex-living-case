
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const mapper = require('../utils/mapper/hostaway.mapper');
const repo = require('../repos/reviews.repo');

const HOSTAWAY_AUTH_URL = 'https://api.hostaway.com/v1/accessTokens';
const HOSTAWAY_REVIEWS_URL = 'https://api.hostaway.com/v1/reviews';
const CLIENT_ID = process.env.HOSTAWAY_CLIENT_ID;
const CLIENT_SECRET = process.env.HOSTAWAY_CLIENT_SECRET;
const SCOPE = 'general';

let cachedToken = null;
let tokenExpiresAt = null;

// Read from file logic
async function fetchAndNormalize() {
  const rawPath = path.join(__dirname, '../../mock/hostaway-sample.json');
  const data = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
  const normalized = data.result.map(mapper.toInternalReview);
  return normalized;
}

async function integrate() {
  const reviews = await fetchAndNormalize();
  // Here you would typically save the reviews to your database but we need to make sure they are unique
  await repo.insertBulkHostawayReviews(reviews);
  return { imported: reviews.length };
}

async function getAccessToken() {
  if (cachedToken && tokenExpiresAt && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);
  params.append('scope', SCOPE);
  const response = await axios.post(HOSTAWAY_AUTH_URL, params, {
    headers: {
      'Cache-control': 'no-cache',
      'Content-type': 'application/x-www-form-urlencoded',
    },
  });
  const { access_token, expires_in } = response.data;
  cachedToken = access_token;
  tokenExpiresAt = Date.now() + expires_in * 1000;
  return access_token;
}

// Read from API logic --- IGNORE ---
async function fetchAndNormalizeFromApi() {
  const token = await getAccessToken();
  const response = await axios.get(HOSTAWAY_REVIEWS_URL, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Cache-control': 'no-cache',
    },
  });
  const data = response.data;
  const normalized = (data.result || []).map(mapper.toInternalReview);
  return normalized;
}

module.exports = { fetchAndNormalize, fetchAndNormalizeFromApi, integrate };