import axios from 'axios';

const BASE_URL = 'https://www.alphavantage.co/query';
const KNOWN_COMPANY_NAMES: Record<string, string> = {
  AAPL: 'Apple Inc.',
  GOOGL: 'Alphabet Inc.',
  MSFT: 'Microsoft Corporation',
  NVDA: 'NVIDIA Corporation',
  TSLA: 'Tesla Inc.',
  NFLX: 'Netflix, Inc.',
  AMZN: 'Amazon.com, Inc.'
};

function isUsableText(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '' && value !== 'N/A' && value !== 'None';
}

function isTickerLikeName(name: string, symbol: string): boolean {
  const normalizedName = name.trim().toUpperCase();
  const normalizedSymbol = symbol.toUpperCase();
  const baseSymbol = normalizedSymbol.split('.')[0];

  return normalizedName === normalizedSymbol || normalizedName === baseSymbol;
}

function formatSymbolFallback(symbol: string): string {
  const normalizedSymbol = symbol.toUpperCase();
  const baseSymbol = normalizedSymbol.split('.')[0];
  return KNOWN_COMPANY_NAMES[normalizedSymbol] || KNOWN_COMPANY_NAMES[baseSymbol] || baseSymbol;
}

async function resolveCompanyName(alphaVantageApiKey: string, symbol: string, overviewData: any): Promise<string> {
  const normalizedSymbol = symbol.toUpperCase();
  const overviewName = overviewData?.Name;

  if (isUsableText(overviewName) && !isTickerLikeName(overviewName, normalizedSymbol)) {
    return overviewName;
  }

  const knownName = KNOWN_COMPANY_NAMES[normalizedSymbol] || KNOWN_COMPANY_NAMES[normalizedSymbol.split('.')[0]];
  if (knownName) {
    return knownName;
  }

  try {
    const searchResponse = await axios.get(BASE_URL, {
      params: {
        function: 'SYMBOL_SEARCH',
        keywords: normalizedSymbol,
        apikey: alphaVantageApiKey
      }
    });

    const matches = Array.isArray(searchResponse.data?.bestMatches) ? searchResponse.data.bestMatches : [];
    const exactMatch = matches.find((match: any) => {
      const matchedSymbol = String(match?.['1. symbol'] || '').toUpperCase();
      return matchedSymbol === normalizedSymbol || matchedSymbol === normalizedSymbol.split('.')[0];
    });

    const bestMatch = exactMatch || matches[0];
    const searchName = bestMatch?.['2. name'];

    if (isUsableText(searchName)) {
      return searchName;
    }
  } catch (error) {
    // Ignore search failures and fall back to a readable symbol-based label.
  }

  return formatSymbolFallback(normalizedSymbol);
}

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  timestamp: string;
}

export async function getStockData(symbol: string): Promise<StockData> {
  try {
    const alphaVantageApiKey = process.env.ALPHA_VANTAGE_API_KEY;
    // For demo purposes, return mock data if no API key
    if (!alphaVantageApiKey || alphaVantageApiKey === 'your_alpha_vantage_api_key_here') {
      return getMockStockData(symbol);
    }

    // Fetch real-time quote
    const quoteResponse = await axios.get(BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol,
        apikey: alphaVantageApiKey
      }
    });

    // Fetch company overview
    const overviewResponse = await axios.get(BASE_URL, {
      params: {
        function: 'OVERVIEW',
        symbol: symbol,
        apikey: alphaVantageApiKey
      }
    });

    const quoteData = quoteResponse.data['Global Quote'];
    const overviewData = overviewResponse.data;

    if (!quoteData || !overviewData) {
      throw new Error('Invalid stock symbol or API limit reached');
    }

    const price = parseFloat(quoteData['05. price']);
    const rawMarketCap = parseFloat(overviewData.MarketCapitalization);
    const sharesOutstanding = parseFloat(overviewData.SharesOutstanding);
    const marketCap = Number.isFinite(rawMarketCap) && rawMarketCap > 0
      ? rawMarketCap
      : (Number.isFinite(sharesOutstanding) && sharesOutstanding > 0 && Number.isFinite(price) ? sharesOutstanding * price : 0);
    const companyName = await resolveCompanyName(alphaVantageApiKey, symbol, overviewData);

    return {
      symbol: symbol.toUpperCase(),
      name: companyName,
      price,
      change: parseFloat(quoteData['09. change']),
      changePercent: parseFloat(quoteData['10. change percent'].replace('%', '')),
      volume: parseInt(quoteData['06. volume']),
      marketCap,
      peRatio: parseFloat(overviewData.PERatio) || 0,
      dividendYield: parseFloat(overviewData.DividendYield) || 0,
      high: parseFloat(quoteData['03. high']),
      low: parseFloat(quoteData['04. low']),
      open: parseFloat(quoteData['02. open']),
      previousClose: parseFloat(quoteData['08. previous close']),
      timestamp: new Date().toISOString()
    };
  } catch (error: any) {
    // Fallback to mock data
    return getMockStockData(symbol);
  }
}

function getMockStockData(symbol: string): StockData {
  const mockData: Record<string, StockData> = {
    'AAPL': {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 175.34,
      change: 2.15,
      changePercent: 1.24,
      volume: 58392000,
      marketCap: 2.7e12,
      peRatio: 28.5,
      dividendYield: 0.55,
      high: 176.25,
      low: 172.80,
      open: 173.50,
      previousClose: 173.19,
      timestamp: new Date().toISOString()
    },
    'GOOGL': {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: 152.45,
      change: 1.25,
      changePercent: 0.83,
      volume: 24567000,
      marketCap: 1.9e12,
      peRatio: 25.8,
      dividendYield: 0,
      high: 153.20,
      low: 150.80,
      open: 151.50,
      previousClose: 151.20,
      timestamp: new Date().toISOString()
    },
    'MSFT': {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      price: 415.86,
      change: 3.42,
      changePercent: 0.83,
      volume: 21458000,
      marketCap: 3.1e12,
      peRatio: 35.2,
      dividendYield: 0.73,
      high: 417.50,
      low: 412.20,
      open: 413.50,
      previousClose: 412.44,
      timestamp: new Date().toISOString()
    },
    'NVDA': {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      price: 128.74,
      change: 2.18,
      changePercent: 1.72,
      volume: 45218000,
      marketCap: 3.2e12,
      peRatio: 68.4,
      dividendYield: 0.03,
      high: 129.9,
      low: 126.8,
      open: 127.1,
      previousClose: 126.56,
      timestamp: new Date().toISOString()
    }
  };

  return mockData[symbol.toUpperCase()] || {
    symbol: symbol.toUpperCase(),
    name: 'Unknown Company',
    price: 100.00,
    change: 0,
    changePercent: 0,
    volume: 0,
    marketCap: 0,
    peRatio: 0,
    dividendYield: 0,
    high: 100,
    low: 100,
    open: 100,
    previousClose: 100,
    timestamp: new Date().toISOString()
  };
}