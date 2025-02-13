import mongoose from "mongoose";

const ConfigSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
  base: { type: String, required: true },
  name: { type: String, required: true },
  allowedBudget: { type: Number, required: true, default: 100 },
  tradingEnabled: { type: Boolean, required: true },
  riskPercentage: { type: Number, required: true, default: 1 },
  stopLoss: { type: Number, required: true, default: 2 },
  cooldown: { type: Number, required: true, default: 48 },
  lastTradeTime: { type: Date, default: null },
});

const Config = mongoose.model("Config", ConfigSchema);

export default Config;
