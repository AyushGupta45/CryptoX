import Config from "../models/config.model.js";
import { fetchHistoricalData } from "../controller/binance.js";
import { EMA, MACD, RSI, Stochastic, OBV, SMA, ATR } from "technicalindicators";

const GEMINI_API_KEY = "AIzaSyDlp3_6QVcNZav3LBf7LGsyQEz1d8-goQY";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

// Hardcoded Indicator Configuration
const INDICATOR_CONFIG = {
  ema: {
    periodShort: 20,
    periodLong: 50,
    weight: 0.4,
  },
  macd: {
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    weight: 0.3,
  },
  rsi: {
    period: 14,
    overbought: 70,
    oversold: 30,
    weight: 0.3,
  },
  stoch: {
    period: 14,
    weight: 0.2,
  },
  atr: {
    period: 14,
  },
};


const preprocessData = async (symbol) => {
  const timeframes = ["15m", "1h", "4h"]; 
  const allData = await Promise.all(
    timeframes.map((tf) => fetchHistoricalData(symbol, tf, 100))
  );

  return timeframes.map((tf, i) => {
    const data = allData[i];
    const closes = data.map((d) => d.close);
    const highs = data.map((d) => d.high);
    const lows = data.map((d) => d.low);
    const volumes = data.map((d) => d.volume);

    return {
      timeframe: tf,
      data: data.map((d, i) => ({
        ...d,
        ema20: EMA.calculate({ period: INDICATOR_CONFIG.ema.periodShort, values: closes })[i] || d.close,
        ema50: EMA.calculate({ period: INDICATOR_CONFIG.ema.periodLong, values: closes })[i] || d.close,
        macd: MACD.calculate({
          values: closes,
          fastPeriod: INDICATOR_CONFIG.macd.fastPeriod,
          slowPeriod: INDICATOR_CONFIG.macd.slowPeriod,
          signalPeriod: INDICATOR_CONFIG.macd.signalPeriod,
        })[i] || { MACD: 0, signal: 0 },
        rsi: RSI.calculate({ period: INDICATOR_CONFIG.rsi.period, values: closes })[i] || 50,
        stoch: Stochastic.calculate({
          high: highs,
          low: lows,
          close: closes,
          period: INDICATOR_CONFIG.stoch.period,
        })[i] || { k: 50, d: 50 },
        obv: OBV.calculate({ close: closes, volume: volumes })[i] || 0,
        volumeSMA: SMA.calculate({ period: 20, values: volumes })[i] || d.volume,
        atr: ATR.calculate({ high: highs, low: lows, close: closes, period: INDICATOR_CONFIG.atr.period })[i] || 0,
      })),
    };
  });
};

const analyzeTechnical = (data) => {
  let score = { buy: 0, sell: 0, neutral: 0 };

  data.forEach(({ timeframe, data }) => {
    if (data.length < 2) return;

    const latest = data[data.length - 1];
    const previous = data[data.length - 2];

    // EMA Crossover
    if (latest.ema20 > latest.ema50 && previous.ema20 <= previous.ema50) {
      score.buy += 2 * INDICATOR_CONFIG.ema.weight;
    }

    // MACD Histogram
    const histogram = latest.macd.MACD - latest.macd.signal;
    const prevHistogram = previous.macd.MACD - previous.macd.signal;
    if (histogram > 0 && histogram > prevHistogram) {
      score.buy += INDICATOR_CONFIG.macd.weight;
    }

    // RSI Divergence
    if (latest.rsi < INDICATOR_CONFIG.rsi.oversold) {
      score.buy += INDICATOR_CONFIG.rsi.weight;
    } else if (latest.rsi > INDICATOR_CONFIG.rsi.overbought) {
      score.sell += INDICATOR_CONFIG.rsi.weight;
    }

    // Stochastic Oscillator
    if (latest.stoch.k < 20 && latest.stoch.d < 20) {
      score.buy += INDICATOR_CONFIG.stoch.weight;
    } else if (latest.stoch.k > 80 && latest.stoch.d > 80) {
      score.sell += INDICATOR_CONFIG.stoch.weight;
    }
  });

  const total = Math.max(1, score.buy + score.sell + score.neutral);
  return {
    buy: score.buy / total,
    sell: score.sell / total,
    neutral: score.neutral / total,
  };
};

// Gemini Prediction with Enhanced Prompt
let lastApiCall = 0;
const API_COOLDOWN = 5000; // 5 second cooldown

async function getGeminiPrediction(symbol, dataSummary) {
  try {
    // Rate limiting
    const now = Date.now();
    if (now - lastApiCall < API_COOLDOWN) {
      await new Promise((resolve) =>
        setTimeout(resolve, API_COOLDOWN - (now - lastApiCall))
      );
    }
    lastApiCall = Date.now();

    const prompt = `Analyze this cryptocurrency market data for ${symbol} (current price: $${dataSummary.current_price.toFixed(
      2
    )}) and provide a trading signal (BUY/SELL/NEUTRAL). Technical indicators:
- EMA20: ${dataSummary.ema20.toFixed(2)}
- EMA50: ${dataSummary.ema50.toFixed(2)}
- RSI: ${dataSummary.rsi.toFixed(2)}
- MACD: ${dataSummary.macd.MACD.toFixed(2)}
- Signal: ${dataSummary.macd.signal.toFixed(2)}
- OBV: ${dataSummary.obv}
- Volume Trend: ${dataSummary.volume_trend.join(", ")}

Respond ONLY with one word: BUY, SELL, or NEUTRAL.`;

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

    const data = await response.json();
    const prediction = data?.candidates?.[0]?.content?.parts?.[0]?.text
      ?.trim()
      ?.toUpperCase();

    if (!["BUY", "SELL", "NEUTRAL"].includes(prediction)) {
      throw new Error("Invalid prediction format");
    }

    return prediction;
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    return "NEUTRAL";
  }
}

// Risk-Adjusted Position Sizing
const calculatePositionSize = (config, data) => {
  const latestPrice = data[0].data[data[0].data.length - 1].close;
  const atr = data[0].data[data[0].data.length - 1].atr || 0.01;
  const volatilityFactor = Math.min(2, Math.max(0.5, atr / latestPrice)); // Limit to 0.5x - 2x
  const riskPerTrade =
    config.allowedBudget * (config.riskPercentage / 100) * volatilityFactor;
  return Math.floor(riskPerTrade / (atr * 2));
};

// Main Trading Analysis
export const analyzeTradingDecision = async () => {
  try {
    const enabledConfigs = await Config.find({ tradingEnabled: true });
    if (!enabledConfigs.length) return;

    for (const config of enabledConfigs) {
      const { symbol } = config;
      const multiTimeframeData = await preprocessData(symbol);

      const latest15mData =
        multiTimeframeData[0].data[multiTimeframeData[0].data.length - 1];
      const dataSummary = {
        current_price: latest15mData.close,
        ema20: latest15mData.ema20,
        ema50: latest15mData.ema50,
        rsi: latest15mData.rsi,
        macd: latest15mData.macd,
        obv: latest15mData.obv,
        volume_trend: multiTimeframeData[0].data.slice(-5).map((d) => d.volume),
      };

      const geminiSignal = await getGeminiPrediction(symbol, dataSummary);
      const technicalScore = analyzeTechnical(multiTimeframeData);
      const finalDecision = combineSignals(geminiSignal, technicalScore);

      // Calculate position size before logging
      const positionSize = calculatePositionSize(config, multiTimeframeData);

      console.log(`=== Trade Analysis for ${symbol} ===`);
      console.log(`Gemini AI Signal: ${geminiSignal}`);
      console.log(`Technical Data:`, JSON.stringify(dataSummary, null, 2));
      console.log(`Final Decision: ${finalDecision}`);
      console.log(`Position Size: ${positionSize}`);
      console.log(`==============================`);

      // Execute trade (commented out for now)
      // executeTrade(finalDecision, positionSize, config);
    }
  } catch (error) {
    console.error("Analysis Error:", error);
  }
};

// Combine AI and Technical Analysis Signals
const combineSignals = (aiSignal, technicalScore) => {
  const aiWeight = 0.7;
  const techWeight = 0.3;

  const scores = {
    BUY: (aiSignal === "BUY" ? aiWeight : 0) + technicalScore.buy * techWeight,
    SELL:
      (aiSignal === "SELL" ? aiWeight : 0) + technicalScore.sell * techWeight,
    NEUTRAL:
      (aiSignal === "NEUTRAL" ? aiWeight : 0) +
      technicalScore.neutral * techWeight,
  };

  return Object.entries(scores).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
};

// Execute Trade with Cooldown Check
const executeTrade = async (decision, size, config) => {
  console.log(`${config.symbol}: ${decision} ${size}`);
  await Config.updateOne({ _id: config._id }, { lastTradeTime: new Date() });
};

// Run Trading Analysis
// analyzeTradingDecision();