import mongoose from "mongoose";

const TradeSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true },
    action: { type: String, enum: ["Buy", "Sell"], required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Trade = mongoose.model("Trade", TradeSchema);

export default Trade;
