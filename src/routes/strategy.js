const logger = require('../utils/logger');
const express = require('express');
const router = express.Router();
const { getRSISignal } = require('../strategies/rsi');
const { getBBandsSignal } = require('../strategies/bbands');

router.get('/rsi', async (req, res) => {
    try {
        const unit = req.query.unit || '1m';
        const count = parseInt(req.query.count) || 30;
        const market = req.query.market || 'BTC_KRW';
        const buyThreshold = parseFloat(req.query.buy) || 30;
        const sellThreshold = parseFloat(req.query.sell) || 70;

        const signal = await getRSISignal({ market, unit, count, buyThreshold, sellThreshold });
        res.json({ signal, market, unit, count, buyThreshold, sellThreshold });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/bbands', async (req, res) => {
    try {
        const unit = req.query.unit || '1m';
        const count = parseInt(req.query.count) || 20;
        const market = req.query.market || 'BTC_KRW';
        const stddev = parseFloat(req.query.stddev) || 2.0;

        const signal = await getBBandsSignal({ market, unit, count, stddev });
        res.json({ signal, market, unit, count, stddev });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
