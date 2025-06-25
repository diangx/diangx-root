const axios = require('axios');
const { getAuthHeader } = require('../utils/auth');
const { BITHUMB_API_URL } = process.env;

async function getAccount() {
  const headers = getAuthHeader();
  const url = `${BITHUMB_API_URL}/v1/accounts`;
  const response = await axios.get(url, { headers });
  return response.data;
}

module.exports = {
  getAccount
};
