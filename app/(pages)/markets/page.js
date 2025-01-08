"use client";

import { useFetchMarketData } from "@/hooks/useMarketData";
import MarketCard from "@/components/cards/MarketCard";
import MarketSkeleton from "@/components/loaders/MarketSkeleton";

const Markets = () => {
  const { marketData } = useFetchMarketData();

  if (!marketData) {
    return <MarketSkeleton />;
  }

  return <MarketCard marketData={marketData} />;
};

export default Markets;
