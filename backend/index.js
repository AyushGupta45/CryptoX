import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { fetchData } from "./controller/fetchData.js";
import { socket } from "./controller/socket.js";
dotenv.config({path: "../.env.local"});

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

const io = new Server(server, {
  cors: {
    origin: url,
    methods: ["GET", "POST"],
  },
});

io.on("connection", socket);
app.get("/api/marketdata/price", fetchData);

server.listen(process.env.BACKEND_PORT, () => {
  console.log(`Server running on ${process.env.NEXT_PUBLIC_BACKEND_URL}`);
});
