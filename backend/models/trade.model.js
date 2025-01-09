import mongoose from "mongoose";

const TradeSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true },
    entry: { type: Number, required: true },
    exit: { type: Number, required: true },
    quantity: { type: Number, required: true },
    time: { type: Date, default: Date.now, required: true },
  },
  {
    timestamps: true,
  }
);

const Trade = mongoose.model("Trade", TradeSchema);

export default Trade;
