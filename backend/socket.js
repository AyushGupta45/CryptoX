// backend/socket.js
import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import { fetchHistoricalData, startKlineStream } from "./binance.js"; // Adjusted import path

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});


io.on("connection", (socket) => {
  const subscriptions = new Set();

  socket.on("subscribeToSymbol", async ({ symbol, interval }) => {
    if (subscriptions.has(symbol)) return;

    subscriptions.add(symbol);

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
      console.error("Error fetching historical data:", error);
    }
  });

  socket.on("unsubscribeFromSymbol", ({ symbol }) => {
    subscriptions.delete(symbol);
  });

  socket.on("disconnect", () => {
    subscriptions.clear();
  });
});


server.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
