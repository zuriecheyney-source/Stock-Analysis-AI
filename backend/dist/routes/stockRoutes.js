"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stockService_1 = require("../services/stockService");
const router = express_1.default.Router();
// Get stock data by symbol
router.get('/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const data = await (0, stockService_1.getStockData)(symbol);
        res.json(data);
    }
    catch (error) {
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
            ].filter(item => item.symbol.toLowerCase().includes(query.toLowerCase()) ||
                item.name.toLowerCase().includes(query.toLowerCase()))
        });
    }
    catch (error) {
        console.error('Error searching stocks:', error);
        res.status(500).json({ error: error.message || 'Failed to search stocks' });
    }
});
exports.default = router;
//# sourceMappingURL=stockRoutes.js.map