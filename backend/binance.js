// backend/binance.js
import Binance from "binance-api-node";

const client = Binance.default({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_SECRET_KEY,
  httpBase: process.env.BINANCE_TESTNET_URL,
});

export const fetchHistoricalData = async (
  symbol,
  interval = "1d",
  limit = 1000
) => {
  try {
    const historicalData = await client.candles({ symbol, interval, limit });
    return historicalData.map((data) => ({
      time: new Date(data.openTime).toISOString(),
      open: parseFloat(data.open),
      high: parseFloat(data.high),
      low: parseFloat(data.low),
      close: parseFloat(data.close),
      volume: parseFloat(data.volume),
    }));
  } catch (error) {
    console.error(`Failed to fetch historical data for ${symbol}:`, error);
    return [];
  }
};

export const startKlineStream = (symbol, interval, onUpdate) => {
  try {
    client.ws.candles(symbol, interval, (kline) => {
      const newPoint = {
        time: new Date(kline.startTime).toISOString(),
        open: parseFloat(kline.open),
        high: parseFloat(kline.high),
        low: parseFloat(kline.low),
        close: parseFloat(kline.close),
        volume: parseFloat(kline.volume),
      };
      onUpdate(newPoint);
    });
  } catch (error) {
    console.error(`Failed to start Kline stream for ${symbol}:`, error);
  }
};
