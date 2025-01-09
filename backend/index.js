import express from "express";
import mongoose from "mongoose";
import { Server } from "socket.io";
import Binance from "binance-api-node";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { fetchData } from "./controller/fetchData.js";
import { socket } from "./controller/socket.js";
import {
  getAccount,
  getBalance,
  handleBuy,
  handleSell,
} from "./controller/binance.js";

import {
  getConfigs,
  createConfig,
  updateConfigAllowedAmount,
  updateConfigTradingEnabled,
} from "./controller/configuration.js";
import {
  createStrategy,
  getStrategies,
  getStrategy,
  updateIndicatorEnabled,
  updateStrategy,
} from "./controller/strategy.js";

dotenv.config({ path: "../.env.local" });
const app = express();
const server = createServer(app);
const url = process.env.NEXT_PUBLIC_NEXT_URL;

app.use(
  cors({
    origin: url,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("Database is Connected");
});

const io = new Server(server, {
  cors: {
    origin: url,
    methods: ["GET", "POST"],
  },
});

export const userClient = Binance.default({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_SECRET_KEY,
  httpBase: process.env.BINANCE_TESTNET_URL,
});

io.on("connection", socket);
app.get("/api/marketdata/price", fetchData);

//binance routes
app.get("/api/account-info/get-account", getAccount);
app.get("/api/account-info/get-balance", getBalance);
app.post("/api/trade/buy", handleBuy);
app.post("/api/trade/sell", handleSell);

//configuration routes
app.get("/api/config/get-configs", getConfigs);
app.post("/api/config/create-config", createConfig);
app.post(
  "/api/config/updateConfigAllowedAmount/:symbol",
  updateConfigAllowedAmount
);
app.post(
  "/api/config/updateConfigTradingEnabled/:symbol",
  updateConfigTradingEnabled
);

//strategy routes
app.get("/api/strategy/get-strategies", getStrategies);
app.get("/api/strategy/get-strategy/:symbol", getStrategy);
app.post("/api/strategy/create-strategy", createStrategy);
app.post("/api/strategy/update-strategy/:symbol", updateStrategy);
app.post("/api/strategy/update-indicator/", updateIndicatorEnabled);

server.listen(process.env.BACKEND_PORT, () => {
  console.log(`Server running on ${process.env.NEXT_PUBLIC_BACKEND_URL}`);
});
