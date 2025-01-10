"use client";

import { useFetchMarketData } from "@/hooks/useMarketData";
import MarketCard from "@/components/cards/MarketCard";
import MarketSkeleton from "@/components/loaders/MarketSkeleton";

const Markets = () => {
  const { marketData } = useFetchMarketData();

  return (
    <div className="select-none">
      <h1 className="text-3xl font-bold text-gray-700">Markets</h1>
      <p className="text-xs text-gray-400 mb-4">
        Track and analyze market trends
      </p>
      {marketData ? (
        <MarketCard marketData={marketData} />
      ) : (
        <MarketSkeleton/>
      )}
    </div>
  );
};

export default Markets;
