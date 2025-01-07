"use client";

import { useFetchMarketData } from "@/hooks/useMarketData";
import MarketCard from "@/components/MarketCard";
import MarketSkeleton from "@/components/MarketSkeleton";

const Markets = () => {
  const { marketData } = useFetchMarketData();

  if (!marketData) {
    return <MarketSkeleton />;
  }

  return <MarketCard marketData={marketData} />;
};

export default Markets;
