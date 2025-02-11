"use client";

import AssetsTable from "@/components/tables/AssetsTable";
import React, { use } from "react";
import { useFetchBalance } from "@/hooks/usefetchBalance";
import { Skeleton } from "@/components/ui/skeleton";
import TradesTable from "@/components/tables/TradesTable";
import { useFetchTrades } from "@/hooks/usefetchTrades";
import SimplePieChart from "@/components/charts/SimplePieChart";
import PositionsTable from "@/components/tables/PositionsTable";

const Portfolio = () => {
  const balance = useFetchBalance();
  const trades = useFetchTrades();

  return (
    <div className="flex flex-row w-full justify-center h-full gap-8">
      <div className="w-full flex flex-col gap-6">
        <div className="h-[300px] flex flex-col">
          <div>
            <h1 className="text-3xl font-bold text-gray-700">
              Portfolio Overview
            </h1>
            <p className="text-xs text-gray-400 mb-2">
              Summary of your portfolio performance
            </p>
          </div>
          <div className="flex-1 overflow-auto">
            {trades ? (
              <SimplePieChart trades={trades} />
            ) : (
              <Skeleton className="w-full h-full rounded-none" />
            )}
          </div>
        </div>

        <div className="h-1/2 flex flex-col">
          <div>
            <h1 className="text-3xl font-bold text-gray-700">Open Positions</h1>
            <p className="text-xs text-gray-400 mb-2">
              Currently held positions
            </p>
          </div>
          <div className="flex-1 overflow-auto">
            {trades ? (
              <PositionsTable trades={trades} />
            ) : (
              <Skeleton className="w-full h-full rounded-none" />
            )}
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-6">
        <div className="h-[325px] flex flex-col">
          <div>
            <h1 className="text-3xl font-bold text-gray-700">Asset Holdings</h1>
            <p className="text-xs text-gray-400 mb-2">
              Your current asset distribution
            </p>
          </div>
          <div className="flex-1 overflow-auto">
            {balance ? (
              <AssetsTable balance={balance} />
            ) : (
              <Skeleton className="w-full h-full rounded-none" />
            )}
          </div>
        </div>

        <div className="h-[300px] flex flex-col">
          <div>
            <h1 className="text-3xl font-bold text-gray-700">Trade History</h1>
            <p className="text-xs text-gray-400 mb-2">
              Record of executed trades
            </p>
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
