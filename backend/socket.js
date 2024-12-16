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

const previousData = {};

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("subscribeToSymbol", async ({ symbol, interval }) => {
    console.log(`Subscribed to symbol: ${symbol} with interval: ${interval}`);

    // Fetch and send historical data
    try {
      const historicalData = await fetchHistoricalData(symbol, "1d", "1000");
      previousData[symbol] = historicalData;

      // Emit historical data to the client
      socket.emit("klineData", {
        symbol,
        history: historicalData,
      });
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error);
    }

    // Start real-time Kline stream
    startKlineStream(symbol, interval, (newPoint) => {
      if (!previousData[symbol]) previousData[symbol] = [];
      previousData[symbol].push(newPoint);

      if (previousData[symbol].length > 100) {
        previousData[symbol].shift();
      }
      socket.emit("klineData", {
        symbol,
        newPoint,
        history: previousData[symbol],
      });
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
