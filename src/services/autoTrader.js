const logger = require('../utils/logger');
const strategy = require('../config/strategy.config');
const { getRSISignal } = require('../strategies/rsi');
const { getBBandsSignal } = require('../strategies/bbands');

const { placeBuyOrder, placeSellOrder } = require('./orderService');
const { getCurrentPrice } = require('../services/priceService');  // 추가

async function runAutoTrade() {
    const signals = [];

    if (strategy.rsi?.enabled) {
        try {
            const rsiSignal = await getRSISignal(strategy.rsi);
            signals.push(rsiSignal);
        } catch (error) {
            logger.error(error);
        }
    }

    if (strategy.bbands?.enabled) {
        try {
            const bbSignal = await getBBandsSignal(strategy.bbands);
            signals.push(bbSignal);
        } catch (error) {
            logger.error(error);
        }
    }

    // const unique = new Set(signals);
    try {
        logger.info(`${signals.join(',')}`);

        const market = 'BTC_KRW';
        const price = await getCurrentPrice(market);  // 현재가 불러오기
    
        const allBuy = signals.length > 0 && signals.every(s => s === 'buy');
        const allSell = signals.length > 0 && signals.every(s => s === 'sell');
    
        if (allBuy) {
            await placeBuyOrder({
                market: 'KRW-BTC',
                ord_type: 'price',
                percent: 100
            });
        } else if (allSell) {
            await placeSellOrder({
                market: 'KRW-BTC',
                ord_type: 'market',
                percent: 100
            });
        }
    } catch (error) {
        logger.error(error);
    }
}

module.exports = { runAutoTrade };
