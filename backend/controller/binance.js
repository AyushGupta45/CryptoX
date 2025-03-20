import { formatDecimal } from "../../utils/functions.js";
import { coindata } from "../../constants.js";
import { userClient } from "../index.js";
import Binance from "binance-api-node";
import Trade from "../models/trade.model.js";
import Config from "../models/config.model.js";

const client = Binance.default({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_SECRET_KEY,
  httpBase: process.env.BINANCE_TESTNET_URL,
});
const activeStreams = {};

export const getAccountBalance = async (req, res) => {
  try {
    const accountInfo = await userClient.accountInfo();

    if (!accountInfo || !accountInfo.balances) {
      throw new Error("Failed to fetch account balances.");
    }

    const usdtBalance = accountInfo.balances.find(
      (balance) => balance.asset === "USDT"
    );

    if (!usdtBalance || parseFloat(usdtBalance.free) <= 0) {
      return res.status(200).json({
        availableUSDT: 0,
        message: "No USDT available for spending.",
      });
    }

    return res.status(200).json({
      availableUSDT: parseFloat(usdtBalance.free),
      message: "USDT available for spending retrieved successfully.",
    });
  } catch (error) {
    console.error("Error fetching account info:", error.message);
    return res.status(500).json({
      error: "Failed to fetch account info",
      details: error.message,
    });
  }
};

export const getAssets = async (req, res) => {
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

export const getTrades = async (req, res) => {
  try {
    const trades = await Trade.find();
    res.status(200).json(trades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const executeBuyOrder = async (params) => {
  const { symbol, quantity } = params;

  try {
    // Fetch the config from the database
    const config = await Config.findOne({ symbol });
    if (!config) {
      throw new Error(`No configuration found for symbol: ${symbol}`);
    }

    const order = await userClient.order({
      symbol,
      side: "BUY",
      type: "MARKET",
      quantity: formatDecimal(quantity, 4),
    });

    const entryPrice = parseFloat(order.fills[0].price);
    const stopLossPrice = entryPrice * (1 - config.stopLoss / 100);

    await Trade.create({
      symbol,
      entry: entryPrice,
      quantity: parseFloat(order.origQty),
      investment: entryPrice * parseFloat(order.origQty),
      stopLoss: stopLossPrice,
      riskPercentage: config.riskPercentage,
    });

    return { success: true, order };
  } catch (error) {
    console.error(`Buy order failed for ${symbol}:`, error);
    return { success: false, error: error.message };
  }
};

export const executeSellOrder = async (params) => {
  const { symbol } = params;

  try {
    const openTrades = await Trade.find({ symbol, exit: null });
    if (openTrades.length === 0) {
      return { 
        success: false, 
        error: `No open positions for ${symbol} to sell` 
      };
    }


    const coinInfo = coindata.find((coin) => coin.symbol === symbol);
    const baseAsset = coinInfo?.baseAsset;

    const account = await userClient.accountInfo();
    if (!account || !account.balances) {
      throw new Error("Invalid account data returned from API");
    }

    const assetBalance = account.balances.find(
      (balance) => balance.asset === baseAsset
    );

    const availableQuantity = assetBalance ? parseFloat(assetBalance.free) : 0;

    if (availableQuantity <= 0) {
      return res
        .status(400)
        .json({ error: `Insufficient balance for ${baseAsset}` });
    }

    const order = await userClient.order({
      symbol,
      side: "SELL",
      type: "MARKET",
      quantity: availableQuantity.toFixed(4),
    });

    await Trade.updateMany(
      { symbol, exit: null },
      { exit: parseFloat(order.fills[0].price) }
    );

    return { success: true, order };
  } catch (error) {
    console.error(`Sell order failed for ${symbol}:`, error);
    return { success: false, error: error.message };
  }
};

// Existing Express routes can now use these functions
export const handleBuy = async (req, res) => {
  try {
    const result = await executeBuyOrder(req.body);
    result.success
      ? res.status(200).json(result)
      : res.status(400).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const handleSell = async (req, res) => {
  try {
    const result = await executeSellOrder(req.body);
    result.success
      ? res.status(200).json(result)
      : res.status(400).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

export const fetchData = async (req, res) => {
  try {
    const symbols = coindata.map((coin) => coin.symbol);
    const marketData = await Promise.all(
      symbols.map(async (symbol) => {
        const marketStats = await fetchMarketData([symbol]);
        const historicalData = await fetchHistoricalData(symbol, "1d", 100);

        return {
          ...marketStats[0],
          historicalData,
        };
      })
    );

    res.json(marketData);
  } catch (error) {
    console.error("Error fetching market data:", error);
    res.status(500).json({ error: "Failed to fetch market data" });
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
