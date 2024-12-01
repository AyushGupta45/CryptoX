"use client";
import { createContext, useContext, useState } from "react";

const MarketDataContext = createContext();

export const MarketDataProvider = ({ children }) => {
  const [marketData, setMarketData] = useState(null);

  return (
    <MarketDataContext.Provider value={{ marketData, setMarketData }}>
      {children}
    </MarketDataContext.Provider>
  );
};

export const useMarketData = () => useContext(MarketDataContext);
