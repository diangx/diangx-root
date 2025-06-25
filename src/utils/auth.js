const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { BITHUMB_ACCESS_KEY, BITHUMB_SECRET_KEY } = process.env;

function getAuthHeader() {
  const payload = {
    access_key: BITHUMB_ACCESS_KEY,
    nonce: uuidv4(),
    timestamp: Date.now()
  };
  const token = jwt.sign(payload, BITHUMB_SECRET_KEY);

  return { Authorization: `Bearer ${token}` };
}

module.exports = { getAuthHeader };
