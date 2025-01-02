import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);

const useSocketData = (symbol, interval = "1d") => {
  const [klineData, setKlineData] = useState([]);
  const [dataFrame, setDataFrame] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!symbol) return;

    setKlineData([]);
    setDataFrame([]);
    setLoading(true);

    socket.emit("unsubscribeFromSymbol", { symbol });
    socket.emit("subscribeToSymbol", { symbol, interval });

    const handleKlineData = (data) => {
      if (data.history) {
        setKlineData(data.history);
        setDataFrame(data.history);
        setLoading(false);
      } else if (data.newPoint) {
        setKlineData((prevData) => {
          const newData = [...prevData];
          const newPointDate = new Date(data.newPoint.timestamp).toDateString();
          const lastCandle = newData[newData.length - 1];
          const lastCandleDate = lastCandle
            ? new Date(lastCandle.timestamp).toDateString()
            : null;

          if (lastCandle && lastCandleDate === newPointDate) {
            lastCandle.close = data.newPoint.close;
            lastCandle.high = Math.max(lastCandle.high, data.newPoint.high);
            lastCandle.low = Math.min(lastCandle.low, data.newPoint.low);
            lastCandle.volume = data.newPoint.volume; // Replace volume
          } else {
            newData.push(data.newPoint);
          }

          return newData;
        });

        setDataFrame((prevData) => [...prevData, data.newPoint]);
      }
    };

    socket.on("klineData", handleKlineData);

    return () => {
      socket.emit("unsubscribeFromSymbol", { symbol });
      socket.off("klineData", handleKlineData);
    };
  }, [symbol, interval]);

  return { klineData, dataFrame, loading };
};

export default useSocketData;
