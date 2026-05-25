"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aiService_1 = require("../services/aiService");
const dbService_1 = require("../services/dbService");
const router = express_1.default.Router();
// Analyze stock with AI
router.post('/analyze', async (req, res) => {
    try {
        const { symbol, stockData } = req.body;
        if (!symbol) {
            return res.status(400).json({ error: 'Stock symbol is required' });
        }
        // Analyze with AI
        const analysis = await (0, aiService_1.analyzeStockWithAI)(symbol, stockData);
        // Save to database
        const savedAnalysis = await (0, dbService_1.saveAnalysisToDB)({
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
    }
    catch (error) {
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
    }
    catch (error) {
        console.error('Error fetching analysis history:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch analysis history' });
    }
});
exports.default = router;
//# sourceMappingURL=analysisRoutes.js.map