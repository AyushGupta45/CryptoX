"use client";
import { useEffect, useState } from "react";
import { coindata } from "@/constants";

export const useFetchMarketData = () => {
  const [marketData, setMarketData] = useState(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch("/api/marketdata/price", {
          cache: "no-store",
        });
        if (response.ok) {
          const dynamicData = await response.json();

          const mergedData = dynamicData.map((dynamicItem) => {
            const staticItem = coindata.find(
              (coin) => coin.symbol === dynamicItem.symbol
            );
            return {
              ...dynamicItem,
              ...staticItem,
            };
          });

          setMarketData(mergedData);
        } else {
          console.error("Failed to fetch market data");
        }
      } catch (error) {
        console.error("Error fetching market data:", error);
      }
    };

    fetchMarketData();
  }, []);

  return { marketData };
};
