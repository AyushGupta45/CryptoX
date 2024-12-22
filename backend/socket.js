import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import { fetchHistoricalData, startKlineStream, stopKlineStream } from "./binance.js";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  let currentSubscription = null;

  socket.on("subscribeToSymbol", async ({ symbol, interval }) => {
    if (currentSubscription) {
      stopKlineStream(currentSubscription);
    }

    console.log(`Subscribing to new symbol: ${symbol}`);
    currentSubscription = symbol;

    try {
      const historicalData = await fetchHistoricalData(symbol, interval, "1000");

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
});

server.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
