const logger = require('../utils/logger');
const express = require('express');
const router = express.Router();
const { placeBuyOrder, placeSellOrder } = require('../services/orderService');

router.post('/buy', async (req, res) => {
  try {
    const { market, price, volume, percent } = req.body;

    if (!market || !price) {
      return res.status(400).json({ error: 'market, price required' });
    }

    const result = await placeBuyOrder({ market, price, volume, percent });
    res.json(result);
  } catch (error) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: error.message };
    logger.error(error);
    res.status(status).json(data);
  }
});

router.post('/sell', async (req, res) => {
  try {
    const { market, price, volume, percent } = req.body;

    if (!market || !price) {
      return res.status(400).json({ error: 'market, price required' });
    }

    const result = await placeSellOrder({ market, price, volume, percent });
    res.json(result);
  } catch (error) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: error.message };
    logger.error(error);
    res.status(status).json(data);
  }
});

module.exports = router;
