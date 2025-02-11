"use client";
import { useEffect, useState } from "react";

export const useFetchTrades = () => {
  const [trades, setTrades] = useState(null);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/account-info/get-trades`,
          {
            cache: "no-store",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setTrades(data);
        } else {
          console.error("Failed to fetch balance");
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchTrades();
  }, []);

  return trades;
};
