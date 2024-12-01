import Binance from "binance-api-node";

const createBinanceClient = () => {
  return Binance({
    apiKey: process.env.BINANCE_API_KEY,
    apiSecret: process.env.BINANCE_SECRET_KEY,
    httpBase: process.env.BINANCE_TESTNET_URL, // Use testnet URL
  });
};

const client = createBinanceClient();

// Fetch historical OHLC data
export async function fetchHistoricalData(symbol, interval = "1m", limit = 50) {
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
}

// Start WebSocket stream for real-time OHLC data (server-side only)
export const startKlineStream = (symbol, interval, onUpdate) => {
  client.ws.candles(symbol, interval, (kline) => {
    const newPoint = {
      time: new Date(kline.startTime).toISOString(),
      open: parseFloat(kline.open),
      high: parseFloat(kline.high),
      low: parseFloat(kline.low),
      close: parseFloat(kline.close),
      volume: parseFloat(kline.volume),
    };
    onUpdate(newPoint); // Send the new data back to the client
  });
};
