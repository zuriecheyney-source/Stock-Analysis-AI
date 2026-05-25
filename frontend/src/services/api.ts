import axios from 'axios';
import type { StockData } from '../types/stock';
import type { AIAnalysis } from '../types/analysis';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data.error || 'Server error');
    } else if (error.request) {
      // Request made but no response
      throw new Error('Network error. Please check your connection.');
    } else {
      // Something else happened
      throw new Error('An unexpected error occurred.');
    }
  }
);

export const fetchStockData = async (symbol: string): Promise<StockData> => {
  try {
    const response = await api.get(`/stocks/${symbol}`);
    return response as unknown as StockData;
  } catch (error: any) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};

export const searchStocks = async (query: string): Promise<any> => {
  try {
    const response = await api.get(`/stocks/search/${query}`);
    return response as unknown as any;
  } catch (error: any) {
    console.error('Error searching stocks:', error);
    throw error;
  }
};

export const analyzeStock = async (symbol: string, stockData: StockData): Promise<AIAnalysis> => {
  try {
    const response = await api.post('/analysis/analyze', {
      symbol,
      stockData
    });
    const payload = response as unknown as { analysis?: AIAnalysis } & AIAnalysis;
    return payload.analysis ?? payload;
  } catch (error: any) {
    console.error('Error analyzing stock:', error);
    throw error;
  }
};

export const getAnalysisHistory = async (symbol: string): Promise<any> => {
  try {
    const response = await api.get(`/analysis/history/${symbol}`);
    return response as unknown as any;
  } catch (error: any) {
    console.error('Error fetching analysis history:', error);
    throw error;
  }
};

export const healthCheck = async (): Promise<boolean> => {
  try {
    await api.get('/health');
    return true;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};