const logger = require('../utils/logger');
const axios = require('axios');
const { BITHUMB_API_URL } = process.env;

async function fetchRecentCloses(market = 'BTC_KRW', unit = '1m', count = 30) {
  const res = await axios.get(`${BITHUMB_API_URL}/public/candlestick/${market}/${unit}`);
  const candles = res.data.data;

  const closes = candles
    .slice(0, count + 1)
    .reverse()
    .map(candle => parseFloat(candle[2]));

  return closes;
}

function calculateRSI(closes) {
  const gains = [];
  const losses = [];

  for (let i = 1; i < closes.length; i++) {
    const delta = closes[i] - closes[i - 1];
    if (delta > 0) gains.push(delta);
    else losses.push(Math.abs(delta));
  }

  const avgGain = gains.reduce((a, b) => a + b, 0) / closes.length;
  const avgLoss = losses.reduce((a, b) => a + b, 0) / closes.length;

  const rs = avgGain / (avgLoss || 1);
  return 100 - (100 / (1 + rs));
}

async function getRSISignal({
  market = 'BTC_KRW',
  unit = '1m',
  count = 30,
  buyThreshold = 30,
  sellThreshold = 70
} = {}) {
  const closes = await fetchRecentCloses(market, unit, count);
  const rsi = calculateRSI(closes);

  logger.info(`RSI (${market}, ${unit}, ${count}): ${rsi.toFixed(2)}`);

  if (rsi < buyThreshold) return 'buy';
  if (rsi > sellThreshold) return 'sell';
  return 'hold';
}

module.exports = { getRSISignal };
