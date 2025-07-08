import { GraphQLClient } from "graphql-request";

// You'll need to replace this with your actual subgraph URL
const SUBGRAPH_URL =
  process.env.NEXT_PUBLIC_SUBGRAPH_URL ||
  "https://api.thegraph.com/subgraphs/name/your-subgraph";

export const subgraphClient = new GraphQLClient(SUBGRAPH_URL);

// GraphQL queries for market events
export const GET_MARKET_EVENTS = `
  query GetMarketEvents($marketId: String!, $first: Int!, $skip: Int!, $orderBy: String!, $orderDirection: String!) {
    sharesPurchaseds(
      where: { marketId: $marketId }
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      marketId
      buyer
      isOptionA
      amount
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

export const GET_MARKET_ANALYTICS = `
  query GetMarketAnalytics($marketId: String!) {
    market(id: $marketId) {
      id
      question
      totalVolume
      totalTrades
      createdAt
      endTime
      resolved
      sharesPurchaseds(
        orderBy: blockTimestamp
        orderDirection: desc
        first: 1000
      ) {
        id
        buyer
        isOptionA
        amount
        blockTimestamp
        transactionHash
      }
    }
  }
`;

export const GET_AGGREGATED_MARKET_DATA = `
  query GetAggregatedMarketData($marketId: String!, $from: BigInt!, $to: BigInt!) {
    dailyMarketStats(
      where: { 
        market: $marketId
        date_gte: $from
        date_lte: $to
      }
      orderBy: date
      orderDirection: asc
    ) {
      id
      date
      optionAVolume
      optionBVolume
      totalVolume
      totalTrades
      priceA
      priceB
    }
  }
`;

export interface SharesPurchased {
  id: string;
  marketId: string;
  buyer: string;
  isOptionA: boolean;
  amount: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface MarketData {
  id: string;
  question: string;
  totalVolume: string;
  totalTrades: string;
  createdAt: string;
  endTime: string;
  resolved: boolean;
  sharesPurchaseds: SharesPurchased[];
}

export interface DailyMarketStats {
  id: string;
  date: string;
  optionAVolume: string;
  optionBVolume: string;
  totalVolume: string;
  totalTrades: string;
  priceA: string;
  priceB: string;
}
