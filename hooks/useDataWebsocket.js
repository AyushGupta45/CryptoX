import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

const useDataWebsocket = (symbol, interval = "1d") => {
  const [klineData, setKlineData] = useState([]);

  useEffect(() => {
    if (!symbol) return;

    setKlineData([]);
    socket.emit("unsubscribeFromSymbol", { symbol });
    socket.emit("subscribeToSymbol", { symbol, interval });

    const handleKlineData = (data) => {
      if (data.history) {
        setKlineData(data.history);
      } else if (data.newPoint) {
        setKlineData((prevData) => [...prevData, data.newPoint]);
      }
    };

    socket.on("klineData", handleKlineData);

    return () => {
      socket.emit("unsubscribeFromSymbol", { symbol });
      socket.off("klineData", handleKlineData);
    };
  }, [symbol, interval]);

  return klineData;
};

export default useDataWebsocket;
