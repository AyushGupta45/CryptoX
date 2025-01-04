import { coindata } from "../../constants.js";
import { userClient } from "../index.js";

import Binance from "binance-api-node";

const client = Binance.default({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_SECRET_KEY,
  httpBase: process.env.BINANCE_TESTNET_URL,
});
const activeStreams = {};

export const getAccount = async (req, res) => {
  try {
    const account = await userClient.accountInfo();
    return res.status(200).json(account);
  } catch (error) {
    console.error("Error fetching account info:", error.message);
    return res
      .status(500)
      .json({ error: "Failed to fetch account info", details: error.message });
  }
};

export const getBalance = async (req, res) => {
  try {
    const account = await userClient.accountInfo();
    const data = account.balances
      .filter((balance) => parseFloat(balance.free) > 0)
      .map((balance) => ({
        asset: balance.asset,
        amount: parseFloat(balance.free),
      }));
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching balances:", error.message);
    return res.status(500).json({
      error: "Failed to fetch balances",
      details: error.message,
    });
  }
};

export const handleBuy = async (req, res) => {
  const { symbol, quantity } = req.body;
  try {
    const orderQuantity = quantity.toFixed(4);

    const order = await userClient.order({
      symbol,
      side: "BUY",
      type: "MARKET",
      quantity: orderQuantity,
    });

    res
      .status(200)
      .json({ message: "Trade executed successfully", data: order });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Trade execution failed", details: error.message });
  }
};

export const handleSell = async (req, res) => {
  const { symbol } = req.body;

  if (!symbol) {
    return res.status(400).json({ error: "Symbol is required" });
  }

  try {
    const coinInfo = coindata.find((coin) => coin.symbol === symbol);
    if (!coinInfo) {
      return res
        .status(400)
        .json({ error: `Invalid symbol: ${symbol}. Asset not found.` });
    }

    const baseAsset = coinInfo.baseAsset;

    const account = await userClient.accountInfo();

    if (!account || !account.balances) {
      throw new Error("Invalid account data returned from API");
    }

    const balances = account.balances
      .filter((balance) => parseFloat(balance.free) > 0)
      .map((balance) => ({
        asset: balance.asset,
        amount: parseFloat(balance.free),
      }));

    const userAsset = balances.find((balance) => balance.asset === baseAsset);

    if (!userAsset || userAsset.amount <= 0) {
      return res
        .status(400)
        .json({ error: `Insufficient balance for asset ${baseAsset}` });
    }

    const orderQuantity = userAsset.amount.toFixed(4);
    const order = await userClient.order({
      symbol,
      side: "SELL",
      type: "MARKET",
      quantity: orderQuantity,
    });

    return res.status(200).json({
      message: "Sell order executed successfully",
      data: {
        orderId: order.orderId,
        quantity: parseFloat(order.origQty),
      },
    });
  } catch (error) {
    console.error(`Error executing sell order for ${symbol}:`, error.message);
    return res.status(500).json({
      error: "Sell order execution failed",
      details: error.message,
    });
  }
};

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
      symbol,
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
        symbol,
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
