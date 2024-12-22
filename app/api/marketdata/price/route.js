import { NextResponse } from "next/server";
import { fetchMarketData, fetchHistoricalData } from "@/backend/binance";
import { coindata } from "@/constants";

export async function GET(req) {
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

    return NextResponse.json(marketData, {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Error fetching market data:", error);
    return NextResponse.json(
      { error: "Failed to fetch market data" },
      { status: 500 }
    );
  }
}
