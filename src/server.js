require('dotenv').config();
const express = require('express');
const accountRoute = require('./routes/account');
const orderRoute = require('./routes/order');
const priceRoute = require('./routes/price');
const strategyRoutes = require('./routes/strategy');
const { runAutoTrade } = require('./services/autoTrader');

const feargreed = require('./routes/feargreed/index');

const app = express();
app.use(express.json());
app.use('/account', accountRoute);
app.use('/order', orderRoute);
app.use('/price', priceRoute);
app.use('/strategy', strategyRoutes);

app.use('/api/feargreed', feargreed);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// setInterval(runAutoTrade, 60 * 1000);// 60 * 1000 = 1 MINUTE
