import express from "express";
import {
  handleBuy,
  handleSell,
  fetchData,
  getAccountBalance,
  getAssets,
  getTrades,
} from "../controller/binance.js";

const router = express.Router();

// Binance routes
router.get("/marketdata/price", fetchData);
router.get("/account-info/get-balance", getAccountBalance);
router.get("/account-info/get-assets", getAssets);
router.get("/account-info/get-trades", getTrades);
router.post("/trade/buy", handleBuy);
router.post("/trade/sell", handleSell);

export default router;
