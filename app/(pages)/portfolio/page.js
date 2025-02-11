"use client";

import AssetsTable from "@/components/tables/AssetsTable";
import React, { use } from "react";
import { useFetchBalance } from "@/hooks/usefetchBalance";
import { Skeleton } from "@/components/ui/skeleton";
import TradesTable from "@/components/tables/TradesTable";
import { useFetchTrades } from "@/hooks/usefetchTrades";
import SimplePieChart from "@/components/charts/SimplePieChart";
import TradeLineChart from "@/components/charts/TradeLineChart";
import { Separator } from "@/components/ui/separator";

const Portfolio = () => {
  const balance = useFetchBalance();
  const trades = useFetchTrades();

  return (
    <div className="flex flex-row w-full justify-center h-full gap-6">
      <div className="w-full flex flex-col gap-4">
        <div className="h-[300px] flex flex-col">
          <div>
            <h1 className="text-3xl font-bold text-gray-700">Portfolio</h1>
            <p className="text-xs text-gray-400 mb-2">Portfolio Statistics</p>
          </div>
          <div className="flex-1 overflow-auto">
            {trades ? (
              <SimplePieChart trades={trades} />
            ) : (
              <Skeleton className="w-full h-full rounded-none" />
            )}
          </div>
        </div>

        <Separator className="bg-gray-300 w-full" />

        <div className="h-1/2 flex flex-col">
          <div>
            <h1 className="text-3xl font-bold text-gray-700">Chart</h1>
            <p className="text-xs text-gray-400 mb-2">Trade lines chart</p>
          </div>
          <div className="flex-1 overflow-auto">
            {trades ? (
              <TradeLineChart trades={trades} />
            ) : (
              <Skeleton className="w-full h-full rounded-none" />
            )}
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="h-[370px] flex flex-col">
          <div>
            <h1 className="text-3xl font-bold text-gray-700">Balance</h1>
            <p className="text-xs text-gray-400 mb-2">Current Balance</p>
          </div>
          <div className="flex-1 overflow-auto">
            {balance ? (
              <AssetsTable balance={balance} />
            ) : (
              <Skeleton className="w-full h-full rounded-none" />
            )}
          </div>
        </div>

        <div className="h-[260px] flex flex-col">
          <div>
            <h1 className="text-3xl font-bold text-gray-700">Trades</h1>
            <p className="text-xs text-gray-400 mb-2">Trades Executed so for</p>
          </div>
          <div className="flex-1 overflow-auto">
            {trades ? (
              <TradesTable trades={trades} />
            ) : (
              <Skeleton className="w-full h-full rounded-none" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
