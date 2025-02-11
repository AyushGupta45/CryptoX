import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
const SimplePieChart = ({ trades }) => {
  const validTrades = trades.filter((trade) => trade.exit !== null);

  let totalInvestment = 0;
  let profit = 0;
  let loss = 0;

  validTrades.forEach((trade) => {
    totalInvestment += trade.investment;
    const tradeProfitLoss = (trade.exit - trade.entry) * trade.quantity;

    if (tradeProfitLoss >= 0) {
      profit += tradeProfitLoss;
    } else {
      loss += Math.abs(tradeProfitLoss);
    }
  });

  const data = [
    { name: "Profit", value: profit, color: "#00C49F" },
    { name: "Loss", value: loss, color: "#FF4444" },
  ];

  return (
    <div className="flex flex-row items-center justify-center w-full h-full border-2 p-4">
      <div className="w-3/4">
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
              label={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="w-1/4">
        <div className="flex flex-col justify-between">
          <div className="text-start mb-2">
            <div className="text-gray-500">Total Investment</div>
            <div className="text-blue-500 text-xl font-semibold">
              $ {totalInvestment.toFixed(4)}
            </div>
          </div>

          <div className="text-start mb-2">
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
