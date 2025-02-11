import { useFetchTrades } from "@/hooks/usefetchTrades";
import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const SimplePieChart = ({trades}) => {
  const [profit, setProfit] = useState(0);
  const [loss, setLoss] = useState(0);

  useEffect(() => {
    const groupedTrades = {};
    
    trades.forEach((trade) => {
      const { symbol, action, price, quantity } = trade;
      if (!groupedTrades[symbol]) {
        groupedTrades[symbol] = { buy: [], sell: [], holding: 0 };
      }
      if (action.toLowerCase() === "buy") {
        groupedTrades[symbol].buy.push({ price, quantity });
        groupedTrades[symbol].holding += quantity;
      } else {
        groupedTrades[symbol].sell.push({ price, quantity });
        groupedTrades[symbol].holding -= quantity;
      }
    });

    let totalProfit = 0, totalLoss = 0;

    Object.keys(groupedTrades).forEach((symbol) => {
      const buys = groupedTrades[symbol].buy;
      const sells = groupedTrades[symbol].sell;
      
      let matchedBuyQuantity = 0;
      let matchedBuyCost = 0;
      
      buys.forEach(({ price, quantity }) => {
        if (matchedBuyQuantity + quantity <= sells.reduce((sum, trade) => sum + trade.quantity, 0)) {
          matchedBuyQuantity += quantity;
          matchedBuyCost += price * quantity;
        }
      });
      
      const totalSellValue = sells.reduce((sum, trade) => sum + trade.price * trade.quantity, 0);
      
      if (matchedBuyQuantity > 0) {
        const pnl = totalSellValue - matchedBuyCost;
        if (pnl >= 0) {
          totalProfit += pnl;
        } else {
          totalLoss += Math.abs(pnl);
        }
      }
    });

    setProfit(totalProfit);
    setLoss(totalLoss);
  }, [trades]);

  const data = [
    { name: "Profit", value: profit, color: "#2CA58D" },
    { name: "Loss", value: loss, color: "#FF6B6B" },
  ];

  return (
    <div className="flex flex-row items-center justify-center w-full h-full">
      <div className="w-1/2">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              label={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="w-1/2">
        <div className="flex flex-col justify-between">
          <div className="text-start">
            <div className="text-gray-500">Profit</div>
            <div className="text-green-500 text-xl font-semibold">
              $ {profit.toFixed(4)}
            </div>
          </div>
          <div className="text-start">
            <div className="text-gray-500">Loss</div>
            <div className="text-red-500 text-xl font-semibold">
              $ {loss.toFixed(4)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplePieChart;
