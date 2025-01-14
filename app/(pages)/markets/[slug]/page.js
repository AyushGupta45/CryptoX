"use client";

import Kline from "@/components/charts/Kline";
import DataTable from "@/components/tables/DataTable";
import { Separator } from "@/components/ui/separator";
import React from "react";
import useSocketData from "@/hooks/useSocketData";
import { Skeleton } from "@/components/ui/skeleton";
import BuySell from "@/components/trade/buysell";

const MarketPage = ({ params: { slug } }) => {
  const symbol = slug.toUpperCase();
  const { klineData, dataFrame, loading } = useSocketData(symbol, "1d");

  return (
    <div className="w-full h-full select-none">
      <div className="w-full h-full flex flex-row justify-center gap-8">
        <div className="relative w-full">
          {loading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <Kline className="w-full" data={klineData} symbol={symbol} />
          )}
        </div>

        <Separator
          orientation="vertical"
          className="bg-gray-300 w-[0.5px] h-[95%]"
        />
        <div className="flex flex-col gap-8">
          <DataTable data={dataFrame} symbol={symbol} />
          <Separator className="bg-gray-300 w-full" />
          <BuySell symbol={symbol}/>
        </div>
      </div>
    </div>
  );
};

export default MarketPage;
