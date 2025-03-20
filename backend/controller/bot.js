import Config from "../models/config.model.js";
import Trade from "../models/trade.model.js";
import { executeBuyOrder, executeSellOrder, fetchHistoricalData } from "./binance.js";
import ollama from "ollama";

const getMarketData = async (symbol) => {
  const tfData = await Promise.all([
    fetchHistoricalData(symbol, "15m", 20),
    fetchHistoricalData(symbol, "1h", 48),
    fetchHistoricalData(symbol, "4h", 14),
  ]);

  return {
    symbol,
    price: tfData[0][tfData[0].length - 1].close,
    volatility: calculateVolatility(tfData[0]),
    volumeTrend: calculateVolumeTrend(
      tfData.map((d) => d[d.length - 1].volume)
    ),
    keyLevels: findKeyLevels(tfData[2]),
    recentPattern: identifyPattern(tfData[0]),
    movingAverages: calculateMovingAverages(tfData[0]),
  };
};

const calculateVolatility = (data) => {
  const prices = data.slice(-14).map((d) => d.close);
  return (Math.max(...prices) - Math.min(...prices)) / prices[0];
};

const calculateVolumeTrend = (volumes) => {
  const current = volumes[0];
  const avg = volumes.reduce((a, b) => a + b, 0) / volumes.length;
  return current > avg * 1.5 ? "high" : current > avg ? "normal" : "low";
};

const findKeyLevels = (data) => ({
  support: Math.min(...data.slice(-14).map((d) => d.low)),
  resistance: Math.max(...data.slice(-14).map((d) => d.high)),
});

const identifyPattern = (data) => {
  const last3 = data.slice(-3);
  return last3[2].close < last3[1].close && last3[1].close < last3[0].close
    ? "bullish"
    : "bearish";
};

const calculateMovingAverages = (data) => {
  const shortTerm = data.slice(-5).reduce((sum, d) => sum + d.close, 0) / 5;
  const longTerm = data.slice(-20).reduce((sum, d) => sum + d.close, 0) / 20;
  return { shortTerm, longTerm };
};

const calculatePosition = (config, price, volatility) => {
  const baseSize =
    (config.allowedBudget * (config.riskPercentage / 100)) / price;
  const volatilityAdjustment = Math.min(1, 0.5 / volatility);
  return (baseSize * volatilityAdjustment).toFixed(8);
};

async function getOllamaSignal(symbol, data) {
  try {
    const prompt = `STRICTLY ANALYZE THE FOLLOWING ${symbol} TRADING DATA AND 
    RESPOND WITH ONLY ONE WORD: BUY, SELL, OR NEUTRAL. DO NOT INCLUDE ANY EXPLANATION.
    Trading Data:
    - Price: ${data.price}
    - Volatility: ${(data.volatility * 100).toFixed(2)}%
    - Volume: ${data.volumeTrend}
    - Support: ${data.keyLevels.support}
    - Resistance: ${data.keyLevels.resistance}
    - Pattern: ${data.recentPattern}
    - MA Cross: ${data.movingAverages.shortTerm.toFixed(
      2
    )} vs ${data.movingAverages.longTerm.toFixed(2)}`;

    const response = await ollama.generate({
      model: "llama3.1:8b",
      prompt: prompt,
      options: {
        temperature: 0.1,
        max_tokens: 4,
      },
    });

    return validateOllamaResponse(response);
  } catch (error) {
    console.error(`Ollama Error (${symbol}):`, error.message);
    return "NEUTRAL";
  }
}

const validateOllamaResponse = (response) => {
  const text = (response?.response?.trim() || "").toUpperCase();
  if (text.includes("BUY")) return "BUY";
  if (text.includes("SELL")) return "SELL";
  if (text.includes("NEUTRAL") || text.includes("NEUT")) return "NEUTRAL";
  return "NEUTRAL";
};

export const analyzeTradingDecision = async () => {
  try {
    const configs = await Config.find({ tradingEnabled: true });
    if (!configs.length) return;

    for (const config of configs) {
      // if (inCooldown(config)) {
      //   console.log(`${config.symbol} in cooldown`);
      //   continue;
      // }

      const marketData = await getMarketData(config.symbol);
      const signal = await getOllamaSignal(config.symbol, marketData);

      if (signal === "BUY") {
        const quantity = calculatePosition(
          config,
          marketData.price,
          marketData.volatility
        );
        const openTrades = await Trade.countDocuments({
          symbol: config.symbol,
          exit: null,
        });
        if (openTrades === 0) {
          const quantity = calculatePosition(
            config,
            marketData.price,
            marketData.volatility
          );
          await executeOrder(config, "BUY", quantity);
        }
      } else if (signal === "SELL") {
        await executeOrder(config, "SELL", "ALL");
      } else if (signal === "NEUTRAL") {
        executeOrder(config, "NEUTRAL", "NONE");
      }
    }
  } catch (error) {
    console.error("Decision Engine Error:", error);
  }
};

const inCooldown = (config) => {
  const minsSinceLast =
    (Date.now() - new Date(config.lastTradeTime)) / (1000 * 60);
  return minsSinceLast < config.cooldown;
};

const executeOrder = async (config, side, quantity) => {
  if (!config) {
    throw new Error("No configuration found for symbol: undefined");
  }
  try {
    if (side === "BUY") {
      await executeBuyOrder(config.symbol, quantity);
    } else if (side === "SELL") {
      await executeSellOrder(config.symbol,);
    }

    // await Config.updateOne(
    //   { _id: config._id }, 
    //   { lastTradeTime: new Date() }
    // );
    
  } catch (error) {
    console.error(`Order execution failed for ${config.symbol}:`, error);
  }
};
