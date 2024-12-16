"use client";

import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import CryptoChart from "@/components/charts/CryptoChart";

const socket = io("http://localhost:4000");

const MarketPage = ({ params: { slug } }) => {
  const [klineData, setKlineData] = useState([]);

  useEffect(() => {
    if (slug) {
      const symbol = slug.toUpperCase();
      console.log(`Subscribing to symbol: ${symbol}`);

      // Subscribe to the selected symbol
      socket.emit("subscribeToSymbol", { symbol, interval: "1d" });

      // Listener for kline data updates
      const handleKlineData = (data) => {
        if (data.history) {
          setKlineData(data.history);
        } else if (data.newPoint) {
          setKlineData((prevData) => [
            ...prevData.slice(-99),
            data.newPoint,        
          ]);
        }
      };

      socket.on("klineData", handleKlineData);

      return () => {
        console.log(`Unsubscribing from symbol: ${symbol}`);
        socket.off("klineData", handleKlineData);
      };
    }
  }, [slug]);

  return (
    <div>
      <h1>{slug.toUpperCase()} Chart</h1>
      {klineData.length > 0 ? (
        <CryptoChart klineData={klineData} />
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
};

export default MarketPage;
