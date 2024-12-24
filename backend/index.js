import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import {
  fetchHistoricalData,
  startKlineStream,
  stopKlineStream,
} from "./controller/binance.js";
import { fetchData } from "./controller/fetchData.js";

dotenv.config({path: "../.env.local"});

const app = express();
const server = createServer(app);
const url = process.env.NEXT_PUBLIC_NEXT_URL;
console.log("URL",url);

app.use(
  cors({
    origin: url,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

const io = new Server(server, {
  cors: {
    origin: url,
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
});

app.get("/api/marketdata/price", fetchData);

server.listen(process.env.BACKEND_PORT, () => {
  console.log(`Server running on ${process.env.NEXT_PUBLIC_BACKEND_URL}`);
});
