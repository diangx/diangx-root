const logger = require('../utils/logger');
const axios = require('axios');
const { BITHUMB_API_URL } = process.env;

async function fetchCloses(market, unit, count) {
    const url = `${BITHUMB_API_URL}/public/candlestick/${market}/${unit}`;
    const res = await axios.get(url);
    const candles = res.data.data;

    return candles
        .slice(0, count)
        .reverse()
        .map(c => parseFloat(c[2])); // 종가 (close)
}

function calculateBBands(closes, period = 20, multiplier = 2) {
    const slice = closes.slice(-period);
    const avg = slice.reduce((sum, val) => sum + val, 0) / period;
    const variance = slice.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / period;
    const stddev = Math.sqrt(variance);

    return {
        upper: avg + multiplier * stddev,
        middle: avg,
        lower: avg - multiplier * stddev
    };
}

async function getBBandsSignal(config) {
    const {
        market = 'BTC_KRW',
        unit = '1m',
        count = 20,
        multiplier = 2
    } = config;

    const closes = await fetchCloses(market, unit, count);
    const { upper, middle, lower } = calculateBBands(closes, count, multiplier);
    const currentPrice = closes[closes.length - 1];

    logger.info(`BBD (${currentPrice}, ${upper.toFixed(2)}, ${middle.toFixed(2)}, ${lower.toFixed(2)})`);

    const upperDist = Math.abs(currentPrice - upper);
    const middleDist = Math.abs(currentPrice - middle);
    const lowerDist = Math.abs(currentPrice - lower);

    const nearThreshold = (upper - lower) * 0.1;

    let signal = 'hold';

    if (currentPrice <= upper && currentPrice >= middle) {
        if (middleDist < nearThreshold) {
            signal = 'buy';
        } else if (upperDist < nearThreshold) {
            signal = 'sell';
        }
    } else if (currentPrice < middle && currentPrice >= lower) {
        if (middleDist < nearThreshold) {
            signal = 'sell';
        } else if (lowerDist < nearThreshold) {
            signal = 'buy';
        }
    }

    return signal;
}

module.exports = { getBBandsSignal };
