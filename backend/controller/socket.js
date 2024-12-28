import { fetchHistoricalData, startKlineStream, stopKlineStream } from "./binance.js";

export const socket = (socket) => {
    let currentSubscription = null;
  
    socket.on("subscribeToSymbol", async ({ symbol, interval }) => {
      if (currentSubscription) {
        stopKlineStream(currentSubscription);
      }
  
      console.log(`Subscribing to new symbol: ${symbol}`);
      currentSubscription = symbol;
  
      try {
        const historicalData = await fetchHistoricalData(
          symbol,
          interval,
          "1000"
        );
  
        socket.emit("klineData", {
          symbol,
          history: historicalData,
        });
  
        startKlineStream(symbol, interval, (newPoint) => {
          socket.emit("klineData", { symbol, newPoint });
        });
      } catch (error) {
        console.error(`Error subscribing to symbol ${symbol}:`, error);
      }
    });
  
    socket.on("unsubscribeFromSymbol", ({ symbol }) => {
      if (currentSubscription === symbol) {
        stopKlineStream(symbol);
        currentSubscription = null;
      }
    });
  
    socket.on("disconnect", () => {
      if (currentSubscription) {
        stopKlineStream(currentSubscription);
        currentSubscription = null;
      }
    });
  }