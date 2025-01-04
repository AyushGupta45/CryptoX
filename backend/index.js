import express from "express";
import mongoose from 'mongoose';
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { fetchData } from "./controller/fetchData.js";
import { socket } from "./controller/socket.js";
import { getAccount, getBalance } from "./controller/binance.js";
dotenv.config({path: "../.env.local"});
import Binance from "binance-api-node";

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

mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("Database is Connected")
})

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
app.get("/api/account-info/get-account", getAccount);
app.get("/api/account-info/get-balance", getBalance);

server.listen(process.env.BACKEND_PORT, () => {
  console.log(`Server running on ${process.env.NEXT_PUBLIC_BACKEND_URL}`);
});
