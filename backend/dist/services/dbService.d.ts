import { AIAnalysis } from './aiService';
import { StockData } from './stockService';
export interface AnalysisRecord {
    id?: string;
    symbol: string;
    analysis: AIAnalysis;
    stockData: StockData;
    timestamp: string;
}
export declare function saveAnalysisToDB(record: AnalysisRecord): Promise<AnalysisRecord>;
export declare function getAnalysisHistory(symbol: string): Promise<AnalysisRecord[]>;
export declare const CREATE_TABLE_SQL = "\nCREATE EXTENSION IF NOT EXISTS pgcrypto;\n\nCREATE TABLE IF NOT EXISTS stock_analyses (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  symbol VARCHAR(10) NOT NULL,\n  analysis JSONB NOT NULL,\n  stock_data JSONB NOT NULL,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);\n\nCREATE INDEX IF NOT EXISTS idx_stock_analyses_symbol ON stock_analyses(symbol);\nCREATE INDEX IF NOT EXISTS idx_stock_analyses_created_at ON stock_analyses(created_at DESC);\n\n-- Optional: Add RLS (Row Level Security) policies\nALTER TABLE stock_analyses ENABLE ROW LEVEL SECURITY;\n\n-- Policy to allow all operations (adjust based on your needs)\nCREATE POLICY \"Allow all operations\" ON stock_analyses\n  FOR ALL USING (true);\n";
//# sourceMappingURL=dbService.d.ts.map