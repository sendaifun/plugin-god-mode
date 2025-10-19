/**
 * Titan API endpoints
 */
export const TITAN_ENDPOINTS = {
  US: 'wss://us1.api.demo.titan.exchange/api/v1/ws',
  JP: 'wss://jp1.api.demo.titan.exchange/api/v1/ws', 
  DE: 'wss://de1.api.demo.titan.exchange/api/v1/ws'
} as const;

/**
 * Default Titan endpoint (Frankfurt)
 */
export const DEFAULT_TITAN_ENDPOINT = TITAN_ENDPOINTS.DE;

/**
 * Titan WebSocket protocol version
 */
export const TITAN_PROTOCOL = 'v1.api.titan.ag';

/**
 * Default timeout values for Titan operations (optimized for Cloudflare Workers 10s limit)
 */
export const TITAN_TIMEOUTS = {
  CONNECTION: 3000,  // 3 seconds
  RESPONSE: 4000,    // 4 seconds  
  QUOTE: 6000        // 6 seconds
} as const;

/**
 * Default slippage for Titan swaps (3%)
 */
export const DEFAULT_TITAN_SLIPPAGE_BPS = 300;
