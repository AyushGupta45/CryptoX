import Config from "../models/config.model.js";
import Strategy from "../models/strategy.model.js";
import { fetchHistoricalData } from "../controller/binance.js";
import { EMA, MACD, RSI } from "technicalindicators";

export const analyzeTechnicalData = async () => {
  try {
    const enabledConfigs = await Config.find({ tradingEnabled: true });
    if (!enabledConfigs || enabledConfigs.length === 0) {
      console.log("No enabled symbols found.");
      return;
    }

    const symbols = enabledConfigs.map((config) => config.symbol);

    for (const symbol of symbols) {
      const historicalData = await fetchHistoricalData(symbol, "1d", 100);

      if (historicalData.length === 0) {
        console.warn(`No historical data fetched for ${symbol}`);
        continue;
      }

      const strategy = await Strategy.findOne({ symbol });
      if (!strategy) {
        console.warn(`No strategies found for symbol: ${symbol}`);
        continue;
      }

      const closePrices = historicalData.map((data) => data.close);

      // Weight configuration
      const weights = {
        ema: strategy.indicators.ema.weight || 1,
        macd: strategy.indicators.macd.weight || 1,
        rsi: strategy.indicators.rsi.weight || 1,
      };

      let totalScore = 0;
      let totalWeight = 0;
      let riskToRewardRatio = 2; // Default Risk-Reward Ratio

      // EMA Signal with confidence scoring
      if (strategy.indicators.ema.enabled) {
        const emaPeriod = strategy.indicators.ema.period;
        const emaData = EMA.calculate({
          period: emaPeriod,
          values: closePrices,
        });
        const currentEMA = emaData[emaData.length - 1];
        const currentClose = closePrices[closePrices.length - 1];
        const emaConfidence = Math.abs(currentClose - currentEMA) / currentEMA;

        const emaSignalScore =
          strategy.indicators.ema.condition === "above"
            ? currentClose > currentEMA
              ? 1 * emaConfidence
              : -1 * emaConfidence
            : currentClose < currentEMA
            ? 1 * emaConfidence
            : -1 * emaConfidence;

        totalScore += emaSignalScore * weights.ema;
        totalWeight += weights.ema;
      }

      // MACD Signal with confidence scoring
      if (strategy.indicators.macd.enabled) {
        const macdData = MACD.calculate({
          values: closePrices,
          fastPeriod: strategy.indicators.macd.fastPeriod,
          slowPeriod: strategy.indicators.macd.slowPeriod,
          signalPeriod: strategy.indicators.macd.signalPeriod,
        });

        if (macdData.length > 0) {
          const latestMACD = macdData[macdData.length - 1];
          const macdConfidence = Math.abs(latestMACD.MACD - latestMACD.signal);

          const macdSignalScore =
            strategy.indicators.macd.condition === "bullish"
              ? latestMACD.MACD > latestMACD.signal
                ? 1 * macdConfidence
                : -1 * macdConfidence
              : latestMACD.MACD < latestMACD.signal
              ? 1 * macdConfidence
              : -1 * macdConfidence;

          totalScore += macdSignalScore * weights.macd;
          totalWeight += weights.macd;
        }
      }

      // RSI Signal with confidence scoring
      if (strategy.indicators.rsi.enabled) {
        const rsiData = RSI.calculate({
          period: strategy.indicators.rsi.period,
          values: closePrices,
        });
        const currentRSI = rsiData[rsiData.length - 1];
        const rsiConfidence = Math.abs(
          currentRSI - (strategy.indicators.rsi.overbought + strategy.indicators.rsi.oversold) / 2
        );

        const rsiSignalScore =
          strategy.indicators.rsi.condition === "overbought"
            ? currentRSI > strategy.indicators.rsi.overbought
              ? -1 * rsiConfidence
              : 0
            : currentRSI < strategy.indicators.rsi.oversold
            ? 1 * rsiConfidence
            : 0;

        totalScore += rsiSignalScore * weights.rsi;
        totalWeight += weights.rsi;
      }

      // Normalize Score and Apply Risk-Reward Thresholds
      const normalizedScore = totalWeight > 0 ? totalScore / totalWeight : 0;

      let finalSignal = "Neutral";
      const confidenceThreshold = 0.7; // Adjust for stricter decisions

      if (normalizedScore > confidenceThreshold) {
        finalSignal = "Buy";
      } else if (normalizedScore < -confidenceThreshold) {
        finalSignal = "Sell";
      }

      // Risk Management: Only recommend signals with acceptable reward-to-risk
      const potentialReward = Math.abs(
        closePrices[closePrices.length - 1] - closePrices[closePrices.length - 2]
      );
      const potentialRisk = potentialReward / riskToRewardRatio;

      if (finalSignal !== "Neutral" && potentialRisk > potentialReward) {
        console.log(
          `Symbol: ${symbol}, Signal skipped due to poor risk-to-reward ratio.`
        );
        finalSignal = "Neutral";
      }

      console.log(
        `Symbol: ${symbol}, Final Score: ${normalizedScore.toFixed(
          2
        )}, Signal: ${finalSignal}`
      );
    }
  } catch (error) {
    console.error("Error in analyzeTechnicalData:", error);
  }
};
