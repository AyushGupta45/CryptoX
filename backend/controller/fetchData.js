import { coindata } from "../../constants.js";
import { fetchHistoricalData, fetchMarketData } from "./binance.js";

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
