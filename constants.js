export const coindata = [
  {
    symbol: "BTCUSDT",
    baseAsset: "BTC",
    name: "Bitcoin",
  },
  {
    symbol: "ETHUSDT",
    baseAsset: "ETH",
    name: "Ethereum",
  },
  {
    symbol: "SOLUSDT",
    baseAsset: "SOL",
    name: "Solana",
  },
  {
    symbol: "DOGEUSDT",
    baseAsset: "DOGE",
    name: "Dogecoin",
  },
  {
    symbol: "TONUSDT",
    baseAsset: "TON",
    name: "Toncoin",
  },
  {
    symbol: "TUSDUSDT",
    baseAsset: "USDT",
    name: "Tether",
  },
  {
    symbol: "BNBUSDT",
    baseAsset: "BNB",
    name: "Binance",
  },
  {
    symbol: "XRPUSDT",
    baseAsset: "XRP",
    name: "XRP",
  },
  {
    symbol: "ADAUSDT",
    baseAsset: "ADA",
    name: "Cardano",
  },
];

export const Indicators = {
  RSI: {
    name: "RSI",
    description: "Relative Strength Index",
    calcParams: [14],
  },
  MACD: { name: "MACD", description: "Moving Average Convergence Divergence" },
  VOL: { name: "VOL", description: "Volume" },
  MA: { name: "MA", description: "Moving Average" },
  EMA: { name: "EMA", description: "Exponential Moving Average" },
  SMA: { name: "SMA", description: "Simple Moving Average" },
  BOLL: { name: "BOLL", description: "Bollinger Bands" },
  SAR: { name: "SAR", description: "Stop and Reverse" },
  BBI: { name: "BBI", description: "Bull and Bear Index" },
  KDJ: { name: "KDJ", description: "KDJ Index" },
  OBV: { name: "OBV", description: "On Balance Volume" },
};

export const PrimaryIndicators = [
  Indicators.MA,
  Indicators.EMA,
  Indicators.SMA,
  Indicators.BOLL,
  Indicators.SAR,
  Indicators.BBI,
];

export const SecondaryIndicators = Object.values(Indicators);
