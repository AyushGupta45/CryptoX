import express from "express";
import mongoose from "mongoose";
import { Server } from "socket.io";
import Binance from "binance-api-node";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { socket } from "./controller/socket.js";
import binanceRoutes from "./routes/binance.route.js";
import configurationRoutes from "./routes/configuration.route.js";
import strategyRoutes from "./routes/strategy.route.js";

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

app.use("/api", binanceRoutes);
app.use("/api", configurationRoutes);
app.use("/api", strategyRoutes);

server.listen(process.env.BACKEND_PORT, () => {
  console.log(`Server running on ${process.env.NEXT_PUBLIC_BACKEND_URL}`);
});
