import mongoose from "mongoose";

const strategySchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
  },
  indicators: {
    ema: {
      period: {
        type: Number,
        default: 20,
      },
      targetValue: {
        type: Number,
        required: false,
      },
      condition: {
        type: String,
        enum: ["above", "below"],
        required: false,
      },
      enabled: {
        type: Boolean,
        default: true,
      },
    },
    macd: {
      fastPeriod: {
        type: Number,
        default: 12,
      },
      slowPeriod: {
        type: Number,
        default: 26,
      },
      signalPeriod: {
        type: Number,
        default: 9,
      },
      condition: {
        type: String,
        enum: ["bullish", "bearish"],
        required: false,
      },
      enabled: {
        type: Boolean,
        default: true,
      },
    },
    rsi: {
      period: {
        type: Number,
        default: 14,
      },
      overbought: {
        type: Number,
        default: 70,
      },
      oversold: {
        type: Number,
        default: 30,
      },
      condition: {
        type: String,
        enum: ["overbought", "oversold"],
        required: false,
      },
      enabled: {
        type: Boolean,
        default: true,
      },
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Strategy = mongoose.model("Strategy", strategySchema);

export default Strategy;
