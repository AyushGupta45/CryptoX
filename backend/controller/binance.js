import Binance from "binance-api-node";

const client = Binance.default({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_SECRET_KEY,
  httpBase: process.env.BINANCE_TESTNET_URL,
});

const activeStreams = {};

export const fetchMarketData = async (symbols) => {
  try {
    const marketData = await Promise.all(
      symbols.map(async (symbol) => {
        const price = await client.prices({ symbol });
        const stat = await client.dailyStats({ symbol });

        return {
          symbol,
          currentPrice: parseFloat(price[symbol]),
          priceChangePercentage24h: parseFloat(stat.priceChangePercent),
          volume: parseFloat(stat.volume),
          marketCap: parseFloat(stat.quoteVolume),
        };
      })
    );

    return marketData;
  } catch (error) {
    console.error("Error fetching market data:", error);
    throw error;
  }
};

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
  if (activeStreams[symbol]) {
    console.warn(`Stream for ${symbol} is already active.`);
    return;
  }

  try {
    const stream = client.ws.candles(symbol, interval, (kline) => {
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
    activeStreams[symbol] = stream;
  } catch (error) {
    console.error(`Failed to start Kline stream for ${symbol}:`, error);
  }
};

export const stopKlineStream = (symbol) => {
  const stream = activeStreams[symbol];
  if (stream) {
    console.log(`Stopping Kline stream for ${symbol}`);
    stream();
    delete activeStreams[symbol];
  }
};
