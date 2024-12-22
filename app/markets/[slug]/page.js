"use client";

import Kline from "@/components/charts/Kline";
import { Skeleton } from "@/components/ui/skeleton";
import useKlineData from "@/hooks/useWebsocket";
import React, { useState } from "react";

const MarketPage = ({ params: { slug } }) => {
  const symbol = slug.toUpperCase();
  const klineData = useKlineData(symbol, "1d");

  return (
    <div className="w-full h-full select-none">
      {klineData.length > 0 ? (
        <Kline data={klineData} symbol={symbol} />
      ) : (
        <Skeleton className="w-full h-[98%] text-center">Loading</Skeleton>
      )}
    </div>
  );
};

export default MarketPage;
