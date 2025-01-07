import mongoose from "mongoose";

const ConfigSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
  base: { type: String, required: true },
  name: { type: String, required: true },
  minimum: { type: Number, required: true },
  allowedAmount: { type: Number, required: true },
  tradingEnabled: { type: Boolean, required: true },
});

const Config = mongoose.model("Config", ConfigSchema);

export default Config;
