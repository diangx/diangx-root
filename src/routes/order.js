const logger = require('../utils/logger');
const express = require('express');
const router = express.Router();
const { placeBuyOrder, placeSellOrder } = require('../services/orderService');

// now only availiable market order
router.post('/buy', async (req, res) => {
  try {
    const { market, ord_type, volume, percent } = req.body;

    if (!market || !ord_type || percent == null) {
        return res.status(400).json({ error: 'market, ord_type, percent required' });
    }
    
    if (ord_type !== 'price' && volume == null) {
        // todo : limit order
        return res.status(400).json({ error: 'volume required when ord_type is not price' });
    }

    const result = await placeBuyOrder({ market, ord_type, volume, percent });
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
    const { market, ord_type, volume, percent } = req.body;

    if (!market || !ord_type || percent == null) {
        return res.status(400).json({ error: 'market, ord_type, percent required' });
    }
    
    if (ord_type !== 'price' && volume == null) {
        return res.status(400).json({ error: 'volume required when ord_type is not price' });
    }

    const result = await placeSellOrder({ market, ord_type, volume, percent });
    res.json(result);
  } catch (error) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: error.message };
    logger.error(error);
    res.status(status).json(data);
  }
});

module.exports = router;
