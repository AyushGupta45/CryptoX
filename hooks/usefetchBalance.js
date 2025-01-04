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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/account-info/get-balance`,
          {
            cache: "no-store",
          }
        );

        if (response.ok) {
          const data = await response.json();

          // Filter to include only assets present in coindata.baseAsset
          const validAssets = data.filter((asset) =>
            coindata.some((coin) => coin.baseAsset === asset.asset)
          );

          // Merge with image field
          const mergedData = validAssets.map((asset) => {
            const image = getCryptoIcon(asset.asset.toLowerCase());
            return {
              ...asset,
              image,
            };
          });

          setBalance(mergedData);
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
