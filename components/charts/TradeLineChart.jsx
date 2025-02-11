import React, { useEffect, useState } from "react";
import { useFetchTrades } from "@/hooks/usefetchTrades";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatDate } from "@/utils/functions";

const TradeLineChart = () => {
  const trades = useFetchTrades();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!trades) return;

    let cumulativeProfit = 0;
    let cumulativeLoss = 0;
    let processedData = [];

    trades.forEach((trade) => {
      const { action, price, quantity, timestamp } = trade;
      const tradeValue = price * quantity;
      if (action.toLowerCase() === "sell") {
        cumulativeProfit += tradeValue;
      } else {
        cumulativeLoss += tradeValue;
      }
      processedData.push({
        time: formatDate(timestamp),
        profit: cumulativeProfit,
        loss: cumulativeLoss,
      });
    });

    setChartData(processedData);
  }, [trades]);

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="profit" stackId="1" stroke="#2CA58D" fill="#2CA58D" />
          <Area type="monotone" dataKey="loss" stackId="1" stroke="#FF6B6B" fill="#FF6B6B" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TradeLineChart;
