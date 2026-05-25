import express from 'express';
import { getStockData } from '../services/stockService';

const router = express.Router();

// Get stock data by symbol
router.get('/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const data = await getStockData(symbol);
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch stock data' });
  }
});

// Search stocks
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    // This would call Alpha Vantage's search endpoint
    // For now, return mock data
    res.json({
      symbols: [
        { symbol: 'AAPL', name: 'Apple Inc.' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.' },
        { symbol: 'MSFT', name: 'Microsoft Corporation' },
        { symbol: 'TSLA', name: 'Tesla Inc.' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.' }
      ].filter(item => 
        item.symbol.toLowerCase().includes(query.toLowerCase()) || 
        item.name.toLowerCase().includes(query.toLowerCase())
      )
    });
  } catch (error: any) {
    console.error('Error searching stocks:', error);
    res.status(500).json({ error: error.message || 'Failed to search stocks' });
  }
});

export default router;