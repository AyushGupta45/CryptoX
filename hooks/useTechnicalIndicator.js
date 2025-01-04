import { useState, useEffect } from "react";
import { EMA, MACD, RSI } from "technicalindicators";

const useTechnicalIndicators = (dataFrame) => {
  const [processedData, setProcessedData] = useState([]);

  useEffect(() => {
    if (!dataFrame || dataFrame.length === 0) return;

    const calculateIndicators = () => {
      const closePrices = dataFrame.map((item) => item.close);

      // Check if we have enough data points
      const minRequiredDataPoints = Math.max(26, 14); // SlowPeriod for MACD, or RSI period
      if (closePrices.length < minRequiredDataPoints) {
        console.warn("Not enough data to calculate indicators.");
        setProcessedData(
          dataFrame.map((item) => ({ ...item, macd: null, rsi: null }))
        );
        return;
      }

      // MACD
      const macdInput = {
        values: closePrices,
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9,
        SimpleMAOscillator: false,
        SimpleMASignal: false,
      };
      const macd = MACD.calculate(macdInput);

      // EMA
      const emaInput = {
        values: closePrices,
        period: 20,
      };
      const ema = EMA.calculate(emaInput);

      // RSI
      const rsiInput = {
        values: closePrices,
        period: 14,
      };
      const rsi = RSI.calculate(rsiInput);

      // Align the results with the original dataFrame
      const enrichedData = dataFrame.map((item, index) => ({
        ...item,
        macd: macd[index - (closePrices.length - macd.length)] || null,
        rsi: rsi[index - (closePrices.length - rsi.length)] || null,
        ema: ema[index - (closePrices.length - ema.length)] || null,
      }));

      setProcessedData(enrichedData);
    };

    calculateIndicators();
  }, [dataFrame]);

  return processedData;
};

export default useTechnicalIndicators;
