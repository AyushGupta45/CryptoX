# CryptoX

CryptoX is a full-stack cryptocurrency trading and portfolio management platform. It features real-time market data, dynamic charts, virtual portfolio tracking, and automated trading with customizable strategies.

## Features

- **Real-Time Market Data:** Track live prices, market cap, and volume for multiple cryptocurrencies.
- **Dynamic Charts:** Interactive candlestick, line, and area charts with technical indicators.
- **Portfolio Management:** View asset holdings, open positions, and trade history.
- **Automated Trading:** Configure trading bots with risk management, stop-loss, and cooldown settings.
- **Customizable Configuration:** Set allowed budget, risk percentage, and enable/disable trading per asset.
- **Modern UI:** Built with Next.js, Tailwind CSS, and Radix UI for a responsive and accessible experience.

## Project Structure

- `app/` - Next.js app directory (pages, layouts, etc.)
- `components/` - Reusable React components (charts, tables, UI, etc.)
- `backend/` - Express.js backend (API, trading logic, database models)
- `hooks/` - Custom React hooks for data fetching and state management
- `lib/` - Utility functions
- `public/` - Static assets
- `constants.js` - Shared constants (coins, indicators, etc.)
- `screenshots/` - App screenshots

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance (local or cloud)
- Binance API keys (for trading features)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/cryptox.git
   cd CryptoX
   ```

2. **Install dependencies:**
   ```sh
   npm install
   cd backend
   npm install
   cd ..
   ```

3. **Configure environment variables:**
   - Copy `sample .env.local` to `.env.local` in the root and `backend/`
   - Fill in your MongoDB URI, Binance API keys, and other required values.

4. **Run the development servers:**
   ```sh
   npm run dev
   ```
   This starts both the Next.js frontend and the Express backend concurrently.

5. **Open the app:**
   - Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev` - Start frontend and backend in development mode
- `npm run build` - Build the Next.js frontend for production
- `npm start` - Start the frontend in production mode
- `npm run lint` - Run ESLint

## Backend

- Located in [`backend/`](backend/)
- Express.js API for trading, configuration, and data storage
- Uses MongoDB for persistence
- Socket.io for real-time updates

## Frontend

- Located in [`app/`](app/) and [`components/`](components/)
- Next.js App Router
- Tailwind CSS for styling
- Radix UI for accessible components
- Charts powered by [klinecharts](https://github.com/klinecharts/klinecharts) and [recharts](https://recharts.org/)

## Customization

- Edit [`constants.js`](constants.js) to add or modify supported coins and indicators.
- UI components can be customized in [`components/ui/`](components/ui/).


---

*CryptoX - The Future of Finance*