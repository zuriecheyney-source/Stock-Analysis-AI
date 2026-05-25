import express from 'express';
import { analyzeStockWithAI } from '../services/aiService';
import { saveAnalysisToDB } from '../services/dbService';

const router = express.Router();

// Analyze stock with AI
router.post('/analyze', async (req, res) => {
  try {
    const { symbol, stockData } = req.body;

    if (!symbol) {
      return res.status(400).json({ error: 'Stock symbol is required' });
    }

    // Analyze with AI
    const analysis = await analyzeStockWithAI(symbol, stockData);

    // Save to database
    const savedAnalysis = await saveAnalysisToDB({
      symbol,
      analysis,
      stockData,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      analysis: savedAnalysis.analysis,
      id: savedAnalysis.id
    });
  } catch (error: any) {
    console.error('Error analyzing stock:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to analyze stock',
      success: false 
    });
  }
});

// Get analysis history
router.get('/history/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    // This would fetch from database
    // For now, return mock history
    res.json({
      symbol,
      history: [
        {
          id: '1',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          analysis: {
            summary: 'Previous analysis: Strong performance with positive outlook',
            sentiment: 'Bullish',
            riskLevel: 'Low'
          }
        }
      ]
    });
  } catch (error: any) {
    console.error('Error fetching analysis history:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch analysis history' });
  }
});

export default router;