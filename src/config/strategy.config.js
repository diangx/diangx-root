module.exports = {
  rsi: {
    enabled: true,
    market: 'BTC_KRW',
    unit: '10m',
    count: 12,
    buyThreshold: 25,
    sellThreshold: 80
  },
  bbands: {
    enabled: true,
    market: 'BTC_KRW',
    unit: '10m',
    count: 12,
    multiplier: 2
  }
};
