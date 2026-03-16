# Crypto Price Tracker

A real-time cryptocurrency price tracker built with React and TypeScript. Live market data is streamed via WebSocket and displayed across a markets dashboard and per-asset detail view.

---

## Setup

```bash
npm install && npm run dev
```

The app starts at [http://localhost:5173](http://localhost:5173).

> **Note:** The frontend connects to a WebSocket server at `ws://localhost:8080`. Make sure the mock server is running before opening the app, otherwise the UI will show a loading state until a connection is established.

---

## Features

| Feature | Description |
|---|---|
| **Live ticker feed** | Prices, mark price, 24h volume, funding rate, and open interest update in real time via `v2/ticker` WebSocket channel |
| **24h price change** | Calculated from the daily open received via the `candlestick_1d` channel |
| **Order book** | Top 10 bids/asks with cumulative depth visualisation via `l2_orderbook` channel |
| **Recent trades** | Live trade feed per asset |
| **Favorites** | Star any asset; persisted in `localStorage` across sessions |
| **Search** | Filter the market list by name or symbol |
| **Auto-reconnect** | WebSocket reconnects automatically up to 5 times on disconnect |
| **Dark / light theme** | Toggle in the header; preference persisted in `localStorage` and initialised from the OS `prefers-color-scheme` |
| **Responsive layout** | Fluid at all widths — the markets table scrolls horizontally on small screens so all columns (including volume) stay accessible; the detail view stacks panels vertically on mobile |

---

## Approach

### WebSocket architecture

A single reusable `useWebSocket` hook manages the connection lifecycle (connect, subscribe/unsubscribe, auto-reconnect). Feature hooks — `useTickerStream`, `useOrderBook`, and `useTrades` — each open their own WebSocket connection scoped to the channels they need, so each view subscribes only to the data it requires and unsubscribes cleanly on unmount.

### State management

State is kept local to each hook using `useRef` for in-flight accumulation and `useState` for React renders. There is no global store — the `App` component passes data down as props, which is sufficient at this scale.

### Theming

All colours are defined as CSS custom properties on `:root` (light) and `[data-theme="dark"]`. The `useTheme` hook toggles the `data-theme` attribute on `<html>` and persists the choice to `localStorage`, so a single source of truth drives the entire visual layer with no JS-level colour logic in components.

### Views

- **Markets list (`TickerTable`)** — subscribes to `v2/ticker` and `candlestick_1d` for all configured symbols simultaneously.
- **Product detail (`ProductDetail`)** — mounts when a row is clicked; subscribes to `l2_orderbook` and `trades` for the selected symbol, and unsubscribes when navigating back.

### Symbols

Tracked assets are configured in `src/config.ts` (`SYMBOLS` array). Adding a new symbol requires only a single entry there.

---

## What I'd Improve With More Time

1. **Price flash animation** — highlight cells green/red for one frame when a price ticks up or down, a common UX pattern in trading UIs.
2. **Candlestick chart** — render an OHLCV chart on the detail page using the `candlestick_1d` (or finer-grained) data already being subscribed to.
3. **Shared WebSocket connection** — currently each hook opens its own connection. A context-based connection pool would multiplex all subscriptions over a single socket, reducing overhead.
4. **Virtual list** — for a larger symbol set the table should virtualise rows rather than render all of them at once.
5. **Tests** — unit tests for the hooks (mocking WebSocket) and snapshot tests for key components.
