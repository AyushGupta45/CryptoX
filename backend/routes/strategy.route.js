import express from "express";
import {
  createStrategy,
  getStrategies,
  getStrategy,
  updateIndicatorEnabled,
  updateStrategy,
} from "../controller/strategy.js";

const router = express.Router();

router.get("/strategy/get-strategies", getStrategies);
router.get("/strategy/get-strategy/:symbol", getStrategy);
router.post("/strategy/create-strategy", createStrategy);
router.post("/strategy/update-strategy/:symbol", updateStrategy);
router.post("/strategy/update-indicator/", updateIndicatorEnabled);

export default router;
