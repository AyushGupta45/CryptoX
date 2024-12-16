"use client";

import React, { useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const CryptoChart = ({ klineData }) => {
  const isInitialRender = useRef(true);

  return (
    <div>
      <LineChart
        width={800}
        height={400}
        data={klineData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="close"
          stroke="#8884d8"
          dot={false}
          isAnimationActive={isInitialRender.current}
          onAnimationEnd={() => (isInitialRender.current = false)}
        />
      </LineChart>
    </div>
  );
};

export default CryptoChart;
