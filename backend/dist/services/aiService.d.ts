import { StockData } from './stockService';
export interface AIAnalysis {
    summary: string;
    sentiment: 'Bullish' | 'Neutral' | 'Bearish';
    riskLevel: 'Low' | 'Medium' | 'High';
    keyPoints?: string[];
    recommendations?: string[];
}
export declare function analyzeStockWithAI(symbol: string, stockData: StockData): Promise<AIAnalysis>;
//# sourceMappingURL=aiService.d.ts.map