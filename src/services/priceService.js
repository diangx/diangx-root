const axios = require('axios');
const { BITHUMB_API_URL } = process.env;

async function getCurrentPrice(market = 'BTC') {
  const url = `${BITHUMB_API_URL}/public/ticker/${market}`;
  const res = await axios.get(url);
  return res.data.data.closing_price;
}

module.exports = { getCurrentPrice };