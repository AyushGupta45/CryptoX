"use client";

import DataTable from "@/components/DataTable";
import { coindata } from "@/constants";
import useDataWebsocket from "@/hooks/useDataWebsocket";
import React from "react";
import { ThreeDots } from "react-loader-spinner";

const Dataframe = () => {
  const symbols = coindata.map((coin) => coin.symbol); // ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'ADAUSDT']

  return (
    <div className="w-full h-full grid grid-cols-3 gap-4 p-4">
      {symbols.map((symbol) => {
        const klineData = useDataWebsocket(symbol, "1d"); // Individual WebSocket connection for each symbol
        return (
          <div
            key={symbol}
            className="border p-4 rounded shadow bg-white flex flex-col items-center"
          >
            <h2 className="text-xl font-semibold mb-2">{symbol}</h2>
            {klineData.length > 0 ? (
              <DataTable data={klineData} symbol={symbol} />
            ) : (
              <div className="w-full h-[200px] flex justify-center items-center">
                <ThreeDots
                  visible={true}
                  height="50"
                  width="50"
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
      })}
    </div>
  );
};

export default Dataframe;
