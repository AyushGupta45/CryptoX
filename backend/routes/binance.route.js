import express from "express";
import {
  getAccount,
  getBalance,
  handleBuy,
  handleSell,
  fetchData,
} from "../controller/binance.js";

const router = express.Router();

// Binance routes
router.get("/marketdata/price", fetchData);
router.get("/account-info/get-account", getAccount);
router.get("/account-info/get-balance", getBalance);
router.post("/trade/buy", handleBuy);
router.post("/trade/sell", handleSell);

export default router;
