export const coindata = [
  {
    symbol: "BTCUSDT",
    baseAsset: "BTC",
    name: "Bitcoin",
    image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
  },
  {
    symbol: "ETHUSDT",
    baseAsset: "ETH",
    name: "Ethereum",
    image: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  },
  {
    symbol: "SOLUSDT",
    baseAsset: "SOL",
    name: "Solana",
    image: "https://cryptologos.cc/logos/solana-sol-logo.png",
  },
  {
    symbol: "DOGEUSDT",
    baseAsset: "DOGE",
    name: "Dogecoin",
    image: "https://cryptologos.cc/logos/dogecoin-doge-logo.png",
  },
  {
    symbol: "TONUSDT",
    baseAsset: "TON",
    name: "Toncoin",
    image: "https://cryptologos.cc/logos/toncoin-ton-logo.png",
  },
  {
    symbol: "TUSDUSDT",
    baseAsset: "USDT",
    name: "Tether",
    image: "https://cryptologos.cc/logos/tether-usdt-logo.png",
  },
  {
    symbol: "BNBUSDT",
    baseAsset: "BNB",
    name: "Binance",
    image: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
  },
  {
    symbol: "XRPUSDT",
    baseAsset: "XRP",
    name: "XRP",
    image: "https://cryptologos.cc/logos/xrp-xrp-logo.png",
  },
  {
    symbol: "ADAUSDT",
    baseAsset: "ADA",
    name: "Cardano",
    image: "https://cryptologos.cc/logos/cardano-ada-logo.png",
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
