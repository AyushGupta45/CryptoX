import express from "express";
import {
  getConfigs,
  createConfig,
  updateConfigTradingEnabled,
  createConfigs,
  updateConfig,
} from "../controller/configuration.js";

const router = express.Router();

router.get("/config/get-configs", getConfigs);
router.post("/config/create-config", createConfig);
router.post("/config/create-configs", createConfigs);
router.post(
  "/config/updateConfig/:symbol",
  updateConfig
);
router.post(
  "/config/updateConfigTradingEnabled/:symbol",
  updateConfigTradingEnabled
);

export default router;
