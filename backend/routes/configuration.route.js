import express from "express";
import {
  getConfigs,
  createConfig,
  updateConfigAllowedAmount,
  updateConfigTradingEnabled,
} from "../controller/configuration.js";

const router = express.Router();

router.get("/config/get-configs", getConfigs);
router.post("/config/create-config", createConfig);
router.post(
  "/config/updateConfigAllowedAmount/:symbol",
  updateConfigAllowedAmount
);
router.post(
  "/config/updateConfigTradingEnabled/:symbol",
  updateConfigTradingEnabled
);

export default router;
