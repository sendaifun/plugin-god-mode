// Polymarket API types based on the official documentation

export interface PolymarketImageOptimized {
  id: string;
  imageUrlSource: string;
  imageUrlOptimized: string;
  imageSizeKbSource: number;
  imageSizeKbOptimized: number;
  imageOptimizedComplete: boolean;
  imageOptimizedLastUpdated: string;
  relID: number;
  field: string;
  relname: string;
}

export interface PolymarketEvent {
  id: string;
  ticker: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  resolutionSource: string;
  startDate: string;
  creationDate: string;
  endDate: string;
  image: string;
  icon: string;
  active: boolean;
  closed: boolean;
  archived: boolean;
  new: boolean;
  featured: boolean;
  restricted: boolean;
  liquidity: number;
  volume: number;
  openInterest: number;
  sortBy: string;
  category: string;
  subcategory: string;
  isTemplate: boolean;
  templateVariables: string;
  published_at: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  commentsEnabled: boolean;
  competitive: number;
  volume24hr: number;
  volume1wk: number;
  volume1mo: number;
  volume1yr: number;
  featuredImage: string;
  disqusThread: string;
  parentEvent: string;
  enableOrderBook: boolean;
  liquidityAmm: number;
  liquidityClob: number;
  negRisk: boolean;
  negRiskMarketID: string;
  negRiskFeeBips: number;
  commentCount: number;
  imageOptimized: PolymarketImageOptimized;
  iconOptimized: PolymarketImageOptimized;
}

export interface PolymarketCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  active: boolean;
  featured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PolymarketTag {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  active: boolean;
  featured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PolymarketMarket {
  id: string;
  question: string | null;
  conditionId: string;
  slug: string | null;
  twitterCardImage: string | null;
  resolutionSource: string | null;
  endDate: string | null;
  category: string | null;
  ammType: string | null;
  liquidity: string | null;
  sponsorName: string | null;
  sponsorImage: string | null;
  startDate: string | null;
  xAxisValue: string | null;
  yAxisValue: string | null;
  denominationToken: string | null;
  fee: string | null;
  image: string | null;
  icon: string | null;
  lowerBound: string | null;
  upperBound: string | null;
  description: string | null;
  outcomes: string | null;
  outcomePrices: string | null;
  volume: string | null;
  active: boolean | null;
  marketType: string | null;
  formatType: string | null;
  lowerBoundDate: string | null;
  upperBoundDate: string | null;
  closed: boolean | null;
  marketMakerAddress: string;
  createdBy: number | null;
  updatedBy: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  closedTime: string | null;
  wideFormat: boolean | null;
  new: boolean | null;
  mailchimpTag: string | null;
  featured: boolean | null;
  archived: boolean | null;
  resolvedBy: string | null;
  restricted: boolean | null;
  marketGroup: number | null;
  groupItemTitle: string | null;
  groupItemThreshold: string | null;
  questionID: string | null;
  umaEndDate: string | null;
  enableOrderBook: boolean | null;
  orderPriceMinTickSize: number | null;
  orderMinSize: number | null;
  umaResolutionStatus: string | null;
  curationOrder: number | null;
  volumeNum: number | null;
  liquidityNum: number | null;
  endDateIso: string | null;
  startDateIso: string | null;
  umaEndDateIso: string | null;
  hasReviewedDates: boolean | null;
  readyForCron: boolean | null;
  commentsEnabled: boolean | null;
  volume24hr: number | null;
  volume1wk: number | null;
  volume1mo: number | null;
  volume1yr: number | null;
  gameStartTime: string | null;
  secondsDelay: number | null;
  clobTokenIds: string | null;
  disqusThread: string | null;
  shortOutcomes: string | null;
  teamAID: string | null;
  teamBID: string | null;
  umaBond: string | null;
  umaReward: string | null;
  fpmmLive: boolean | null;
  volume24hrAmm: number | null;
  volume1wkAmm: number | null;
  volume1moAmm: number | null;
  volume1yrAmm: number | null;
  volume24hrClob: number | null;
  volume1wkClob: number | null;
  volume1moClob: number | null;
  volume1yrClob: number | null;
  volumeAmm: number | null;
  volumeClob: number | null;
  liquidityAmm: number | null;
  liquidityClob: number | null;
  makerBaseFee: number | null;
  takerBaseFee: number | null;
  customLiveness: number | null;
  acceptingOrders: boolean | null;
  notificationsEnabled: boolean | null;
  score: number | null;
  imageOptimized: PolymarketImageOptimized | null;
  iconOptimized: PolymarketImageOptimized | null;
  events: PolymarketEvent[];
  categories: PolymarketCategory[];
  tags: PolymarketTag[];
  creator: string | null;
  ready: boolean | null;
  funded: boolean | null;
  pastSlugs: string | null;
  readyTimestamp: string | null;
  fundedTimestamp: string | null;
  acceptingOrdersTimestamp: string | null;
  competitive: number | null;
  rewardsMinSize: number | null;
  rewardsMaxSpread: number | null;
  spread: number | null;
  automaticallyResolved: boolean | null;
  oneDayPriceChange: number | null;
  oneHourPriceChange: number | null;
  oneWeekPriceChange: number | null;
  oneMonthPriceChange: number | null;
  oneYearPriceChange: number | null;
  lastTradePrice: number | null;
  bestBid: number | null;
  bestAsk: number | null;
  automaticallyActive: boolean | null;
  clearBookOnStart: boolean | null;
  chartColor: string | null;
  seriesColor: string | null;
  showGmpSeries: boolean | null;
  showGmpOutcome: boolean | null;
  manualActivation: boolean | null;
  negRiskOther: boolean | null;
  gameId: string | null;
  groupItemRange: string | null;
  sportsMarketType: string | null;
  line: number | null;
  umaResolutionStatuses: string | null;
  pendingDeployment: boolean | null;
  deploying: boolean | null;
  deployingTimestamp: string | null;
  scheduledDeploymentTimestamp: string | null;
  rfqEnabled: boolean | null;
  eventStartTime: string | null;
}

// Request parameters for list markets
export interface ListMarketsParams {
  limit?: number;
  offset?: number;
  order?: string;
  ascending?: boolean;
  id?: number[];
  slug?: string[];
  clob_token_ids?: string[];
  condition_ids?: string[];
  market_maker_address?: string[];
  liquidity_num_min?: number;
  liquidity_num_max?: number;
  volume_num_min?: number;
  volume_num_max?: number;
  start_date_min?: string;
  start_date_max?: string;
  end_date_min?: string;
  end_date_max?: string;
  tag_id?: number;
  related_tags?: boolean;
  cyom?: boolean;
  uma_resolution_status?: string;
  game_id?: string;
  sports_market_types?: string[];
  rewards_min_size?: number;
  question_ids?: string[];
  include_tag?: boolean;
  closed?: boolean;
}

// Response type for list markets
export type ListMarketsResponse = PolymarketMarket[];

// Trading-related types
export interface PolymarketTrade {
  id: string;
  market: string;
  asset_id: string;
  side: 'BUY' | 'SELL';
  size: string;
  price: string;
  fee_paid: string;
  timestamp: string;
  outcome: string;
  bucket: string;
  owner: string;
  maker_address: string;
  taker_address: string;
  trader_side: string;
  match_time: string;
  transaction_hash: string;
}

export interface GetTradesParams {
  next_cursor?: string;
  market?: string;
  asset_id?: string;
  maker?: string;
  taker?: string;
  start_ts?: string;
  end_ts?: string;
  limit?: number;
}

export interface GetTradesResponse {
  next_cursor: string;
  data: PolymarketTrade[];
}

// Order-related types
export interface PolymarketOrderArgs {
  tokenID: string;
  price: number;
  side: 'BUY' | 'SELL';
  size: number;
  feeRateBps?: number;
  nonce?: string;
  expiration?: string;
}

export interface PolymarketOrder {
  salt: number;
  maker: string;
  signer: string;
  taker: string;
  tokenId: string;
  makerAmount: string;
  takerAmount: string;
  expiration: string;
  nonce: string;
  feeRateBps: string;
  side: string;
  signatureType: number;
  signature: string;
}

export interface CreateOrderResponse {
  success: boolean;
  errorMsg?: string;
  orderId?: string;
  orderHashes?: string[];
  status?: 'matched' | 'live' | 'delayed' | 'unmatched';
}

export interface PlaceOrderParams {
  tokenId: string;
  price: number;
  side: 'BUY' | 'SELL';
  size: number;
  orderType?: 'GTC' | 'FOK' | 'FAK' | 'GTD';
  feeRateBps?: number;
}

export interface CancelOrderParams {
  orderIds: string[];
}

export interface CancelOrderResponse {
  success: boolean;
  errorMsg?: string;
}
