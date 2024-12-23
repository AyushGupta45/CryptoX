"use client";

import Kline from "@/components/charts/Kline";
import { Skeleton } from "@/components/ui/skeleton";
import useKlineData from "@/hooks/useWebsocket";
import React, { useState } from "react";
import { ThreeDots } from "react-loader-spinner";

const MarketPage = ({ params: { slug } }) => {
  const symbol = slug.toUpperCase();
  const klineData = useKlineData(symbol, "1d");

  return (
    <div className="w-full h-full select-none">
      {klineData.length > 0 ? (
        <Kline data={klineData} symbol={symbol} />
      ) : (
        <div className="w-full h-[98%] flex justify-center items-center">
          <ThreeDots
            visible={true}
            height="100"
            width="100"
            color="#4fa94d"
            radius="9"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      )}
    </div>
  );
};

export default MarketPage;
