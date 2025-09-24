// Polymarket API constants
export const POLYMARKET_GAMMA_API_BASE_URL = 'https://gamma-api.polymarket.com';
export const POLYMARKET_CLOB_API_BASE_URL = 'https://clob.polymarket.com';

// API endpoints
export const ENDPOINTS = {
  MARKETS: '/markets',
  TRADES: '/trades',
  ORDER: '/order',
  ORDERS: '/orders',
  CANCEL: '/cancel',
} as const;

// Default pagination
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

// Order sides
export const ORDER_SIDES = {
  BUY: 'BUY',
  SELL: 'SELL',
} as const;

// Order types
export const ORDER_TYPES = {
  GTC: 'GTC', // Good Till Cancelled
  FOK: 'FOK', // Fill Or Kill
  FAK: 'FAK', // Fill And Kill
  GTD: 'GTD', // Good Till Date
} as const;

// Chain ID for Polygon
export const POLYGON_CHAIN_ID = 137;
