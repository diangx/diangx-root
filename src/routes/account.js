const logger = require('../utils/logger');
const express = require('express');
const router = express.Router();
const { getAccount } = require('../services/accountService');

router.get('/', async (req, res) => {
  try {
    const data = await getAccount();
    res.json(data);
  } catch (error) {
    logger.error(error);
    res.status(error.response?.status || 500).json(
      error.response?.data || { error: error.message }
    );
  }
});

module.exports = router;
