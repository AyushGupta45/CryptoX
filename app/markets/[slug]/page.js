"use client";

import Kline from "@/components/charts/Kline";
import useKlineData from "@/hooks/useWebsocket";
import React, { useState } from "react";


const MarketPage = ({ params: { slug } }) => {
  const symbol = slug.toUpperCase();
  const klineData = useKlineData(symbol, "1d");

  return (
    <div className="w-full h-full">
      {klineData.length > 0 ? (
        <Kline
          type="candle_solid"
          axis="normal"
          data={klineData}
        />
      ) : (
        <p className="text-center">Loading chart data...</p>
      )}
    </div>
  );
};

export default MarketPage;
