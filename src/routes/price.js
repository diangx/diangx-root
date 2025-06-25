const logger = require('../utils/logger');
const express = require('express');
const router = express.Router();
const { getCurrentPrice } = require('../services/priceService');

router.get('/:market', async (req, res) => {
  try {
    const { market } = req.params;
    if (!market) return res.status(400).json({ error: 'market required' });

    const price = await getCurrentPrice(market);
    res.json({ market, price });
  } catch (error) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: error.message };
    logger.error(error);
    res.status(status).json(data);
  }
});

module.exports = router;
