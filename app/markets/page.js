"use client";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useMarketData } from "@/context/MarketDataContext";
import SimpleLineChart from "@/components/charts/SimpleLineChart";

const Markets = () => {
  const { marketData, setMarketData } = useMarketData();

  useEffect(() => {
    const fetchMarketData = async () => {
      if (!marketData) {
        try {
          const response = await fetch("/api/marketdata/price");
          if (response.ok) {
            const data = await response.json();
            setMarketData(data);
          } else {
            console.error("Failed to fetch market data");
          }
        } catch (error) {
          console.error("Error fetching market data:", error);
        }
      }
    };

    fetchMarketData();
  }, [marketData, setMarketData]);

  if (!marketData) {
    return (
      <div className="flex flex-wrap justify-start gap-8">
        {Array(9)
          .fill(null)
          .map((_, index) => (
            <Card
              key={index}
              className="shadow-lg rounded-lg p-4 w-[380px] animate-pulse"
            >
              <CardHeader className="flex flex-row items-center p-0 mb-3 gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex flex-col items-start gap-1">
                  <Skeleton className="w-[200px] h-[30px]" />
                  <Skeleton className="w-[80px] h-[20px]" />
                </div>
              </CardHeader>
              <CardContent className="flex flex-row items-center justify-between gap-8 p-0 px-1 pb-2 border-b">
                <Skeleton className="w-[100px] h-[40px]" />
                <Skeleton className="w-[150px] h-[60px]" />
              </CardContent>
              <CardFooter className="flex flex-col items-start p-0 pt-3 text-sm gap-2">
                <Skeleton className="w-[200px] h-[20px]" />
                <Skeleton className="w-[200px] h-[20px]" />
              </CardFooter>
            </Card>
          ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-start gap-8">
      {marketData.map((crypto) => (
        <Card
          key={crypto.symbol}
          className="shadow-lg rounded-lg p-4 w-[380px]"
        >
          <Link href={`/markets/${crypto.symbol}`}>
            <CardHeader className="flex flex-row items-center p-0 mb-3 gap-4">
              <img
                src={crypto.image}
                alt={crypto.name}
                className="w-12 h-12 object-contain"
              />
              <div className="flex flex-col items-start gap-1">
                <CardTitle className="flex flex-row text-3xl font-extrabold text-gray-800 gap-2">
                  <p>{crypto.name}</p>
                  <div className="flex flex-row items-end justify-start">
                    <p className="text-gray-500 text-sm font-bold pb-0.5">
                      ({crypto.symbol.slice(0, -4).toUpperCase()})
                    </p>
                  </div>
                </CardTitle>
                <div className="flex justify-center items-center">
                  <div
                    className={`text-sm font-semibold px-3 py-0.5 rounded-md text-white ${
                      crypto.priceChangePercentage24h > 0
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {crypto.priceChangePercentage24h > 0
                      ? `+${crypto.priceChangePercentage24h.toFixed(2)}%`
                      : `${crypto.priceChangePercentage24h.toFixed(2)}%`}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-row items-center justify-between gap-8 p-0 px-1 pb-2 border-b">
              <div
                className={`text-2xl font-bold ${
                  crypto.priceChangePercentage24h > 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                ${crypto.currentPrice.toLocaleString()}
              </div>

              <SimpleLineChart
                historicalData={crypto.historicalData}
                color={
                  crypto.priceChangePercentage24h > 0 ? "#10b981" : "#ef4444"
                }
              />
            </CardContent>

            <CardFooter className="flex flex-col items-start p-0 pt-3 text-sm gap-2">
              <p className="text-gray-800 font-semibold">
                Market Cap:{" "}
                <span className="text-gray-500">
                  ${crypto.marketCap?.toLocaleString() ?? "N/A"}
                </span>
              </p>
              <p className="text-gray-800 font-semibold">
                24hr Volume:{" "}
                <span className="text-gray-500">
                  ${crypto.volume?.toLocaleString() ?? "N/A"}
                </span>
              </p>
            </CardFooter>
          </Link>
        </Card>
      ))}
    </div>
  );
};

export default Markets;