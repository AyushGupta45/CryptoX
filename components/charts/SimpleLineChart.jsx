import { LineChart, Line, Tooltip } from "recharts";

const SimpleLineChart = ({ historicalData, color }) => {
  const minPrice = Math.min(...historicalData.map((d) => d.close));
  const maxPrice = Math.max(...historicalData.map((d) => d.close));
  const range = maxPrice - minPrice;

  const exaggerationFactor = 1.5;
  const scaledData = historicalData.map((d) => ({
    time: d.time,
    close: d.close,
    exaggeratedClose: ((d.close - minPrice) / range) * exaggerationFactor * 100,
  }));

  return (
    <LineChart width={150} height={60} data={scaledData}>
      <Line
        type="monotone"
        dataKey="exaggeratedClose"
        stroke={color}
        strokeWidth={2}
        dot={false}
        style={{
          filter: `drop-shadow(0px 0px 4px ${color})`,
        }}
      />
      <Tooltip
        content={({ payload }) => {
          if (payload && payload.length > 0) {
            const data = payload[0].payload;
            return (
              <div className="bg-white px-3 py-2 rounded-lg border shadow-sm">
                <p className="text-sm text-gray-800 font-semibold">
                  ${data.close.toFixed(2).toLocaleString()}
                </p>
              </div>
            );
          }
          return null;
        }}
      />
    </LineChart>
  );
};

export default SimpleLineChart;
