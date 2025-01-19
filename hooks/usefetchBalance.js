"use client";
import { useEffect, useState } from "react";
import { getCryptoIcon } from "@/utils/functions";
import { coindata } from "@/constants";

export const useFetchBalance = () => {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/account-info/get-assets`,
          {
            cache: "no-store",
          }
        );

        if (response.ok) {
          const data = await response.json();

          const validAssets = data.filter((asset) =>
            coindata.some((coin) => coin.baseAsset === asset.asset)
          );


          const finalData = validAssets.map((asset) => {
            const coinDetails = coindata.find(
              (coin) => coin.baseAsset === asset.asset
            );

            const image = getCryptoIcon(asset.asset.toLowerCase());

            return {
              ...asset,
              symbol: coinDetails?.symbol || null,
              name: coinDetails?.name || "Unknown",
              image, 
            };
          });
          setBalance(finalData);

        } else {
          console.error("Failed to fetch balance");
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchBalance();
  }, []);

  return balance;
};
