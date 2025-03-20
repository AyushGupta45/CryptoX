import mongoose from "mongoose";

const TradeSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  entry: { type: Number, required: true },
  exit: { type: Number, default: null },
  quantity: { type: Number, required: true },
  investment: { type: Number, required: true },
  stopLoss: { type: Number }, // Added
  riskPercentage: { type: Number }, // Added
}, { timestamps: true });

const Trade = mongoose.model("Trade", TradeSchema);

export default Trade;
