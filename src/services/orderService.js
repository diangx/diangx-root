const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const querystring = require('querystring');
const axios = require('axios');
const { getAccount } = require('./accountService');
// const { getCurrentPrice } = require('./priceService');

const { BITHUMB_ACCESS_KEY: accessKey, BITHUMB_SECRET_KEY: secretKey, BITHUMB_API_URL: apiUrl } = process.env;

function generateJWT(requestBody) {
  const query = querystring.encode(requestBody);
  const alg = 'SHA512';
  const hash = crypto.createHash(alg);
  const queryHash = hash.update(query, 'utf-8').digest('hex');

  const payload = {
    access_key: accessKey,
    nonce: uuidv4(),
    timestamp: Date.now(),
    query_hash: queryHash,
    query_hash_alg: alg
  };

  return jwt.sign(payload, secretKey);
}

async function placeBuyOrder({ market, ord_type, volume, percent }) {
  let price = 0

  if (percent) {
    const account = await getAccount();
    const krwBalance = parseFloat(account.find(a => a.currency === 'KRW')?.balance || 0);
    const usedKRW = Math.floor(krwBalance * (percent / 100) * 0.997);
    price = usedKRW
  }

  const requestBody = {
    market: market,
    side: 'bid',
    ...(ord_type == 'price' ? {} : { volue: '0' }),
    price: price,
    ord_type,
  };

  const jwtToken = generateJWT(requestBody);
  const config = {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      'Content-Type': 'application/json'
    }
  };

  const res = await axios.post(`${apiUrl}/v1/orders`, requestBody, config);
  return res.data;
}

// async function placeSellOrder({ market, volume, price, percent }) {
async function placeSellOrder ({ market, ord_type, volume, percent }) {
  if (percent) {
    const account = await getAccount();
    const coin = market.split('-')[1];
    const coinBalance = parseFloat(account.find(a => a.currency === coin)?.balance || 0);
    volume = coinBalance;
  }

  const requestBody = {
    market,
    side: 'ask',
    volume,
    ord_type: 'market'
  };

  const jwtToken = generateJWT(requestBody);
  const config = {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      'Content-Type': 'application/json'
    }
  };

  const res = await axios.post(`${apiUrl}/v1/orders`, requestBody, config);
  return res.data;
}

module.exports = {
  placeBuyOrder,
  placeSellOrder
};
