import { NextResponse } from "next/server";
import { coindata } from "@/constants";
import { fetchHistoricalData } from "@/backend/binance";

export async function GET() {
  try {
    const marketDataPromises = coindata.map(async (coin) => {
      const statsUrl = `https://testnet.binance.vision/api/v3/ticker/24hr?symbol=${coin.symbol}`;
      const priceUrl = `https://testnet.binance.vision/api/v3/ticker/price?symbol=${coin.symbol}`;

      const [statsRes, pricesRes] = await Promise.all([
        fetch(statsUrl),
        fetch(priceUrl),
      ]);

      if (!statsRes.ok || !pricesRes.ok) {
        throw new Error(`Failed to fetch data for ${coin.symbol}`);
      }

      const statsData = await statsRes.json();
      const pricesData = await pricesRes.json();

      const historicalData = await fetchHistoricalData(coin.symbol);

      return {
        symbol: coin.symbol,
        name: coin.name,
        baseAsset: coin.baseAsset,
        image: coin.image,
        currentPrice: pricesData ? parseFloat(pricesData.price) : null,
        priceChangePercentage24h: statsData
          ? parseFloat(statsData.priceChangePercent)
          : null,
        volume: statsData ? parseFloat(statsData.volume) : null,
        marketCap: statsData ? parseFloat(statsData.quoteVolume) : null,
        historicalData,
      };
    });

    const marketData = await Promise.all(marketDataPromises);

    return NextResponse.json(marketData);
  } catch (error) {
    console.error("Error fetching market data:", error);
    return NextResponse.json(
      { error: "Failed to fetch market data" },
      { status: 500 }
    );
  }
}
