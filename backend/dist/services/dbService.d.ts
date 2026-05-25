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
export declare const CREATE_TABLE_SQL = "\nCREATE TABLE IF NOT EXISTS stock_analyses (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  symbol VARCHAR(10) NOT NULL,\n  analysis JSONB NOT NULL,\n  stock_data JSONB NOT NULL,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n  \n  -- Add indexes for better query performance\n  INDEX idx_symbol (symbol),\n  INDEX idx_created_at (created_at DESC)\n);\n\n-- Optional: Add RLS (Row Level Security) policies\nALTER TABLE stock_analyses ENABLE ROW LEVEL SECURITY;\n\n-- Policy to allow all operations (adjust based on your needs)\nCREATE POLICY \"Allow all operations\" ON stock_analyses\n  FOR ALL USING (true);\n";
//# sourceMappingURL=dbService.d.ts.map