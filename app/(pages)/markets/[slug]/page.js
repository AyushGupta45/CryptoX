"use client";

import Kline from "@/components/charts/Kline";
import DataTable from "@/components/DataTable";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { ThreeDots } from "react-loader-spinner";
import useSocketData from "@/hooks/useSocketData";

const MarketPage = ({ params: { slug } }) => {
  const symbol = slug.toUpperCase();
  const { klineData, dataFrame, loading } = useSocketData(symbol, "1d");

  return (
    <div className="w-full h-full select-none">
      {!loading ? (
        <div className="w-full h-full flex flex-row items-center justify-center gap-8">
          <Kline className="w-full" data={klineData} symbol={symbol} />
          <Separator
            orientation="vertical"
            className="bg-gray-300 w-[0.5px] h-[90%]"
          />
          <DataTable data={dataFrame} symbol={symbol} />
        </div>
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
