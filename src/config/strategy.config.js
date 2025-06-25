module.exports = {
  rsi: {
    enabled: true,
    market: 'ETH_KRW',
    unit: '10m',
    count: 60,
    buyThreshold: 25,
    sellThreshold: 80
  },
  bbands: {
    enabled: true,
    market: 'ETH_KRW',
    unit: '10m',
    count: 60,
    multiplier: 2
  }
};
