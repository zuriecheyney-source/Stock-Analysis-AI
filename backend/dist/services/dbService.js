"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CREATE_TABLE_SQL = void 0;
exports.saveAnalysisToDB = saveAnalysisToDB;
exports.getAnalysisHistory = getAnalysisHistory;
const supabase_js_1 = require("@supabase/supabase-js");
// Initialize Supabase client if credentials are available
function getSupabaseClient() {
    const rawSupabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    const supabaseUrl = rawSupabaseUrl?.replace(/\/rest\/v1\/?$/, '');
    return supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_url_here' && supabaseAnonKey !== 'your_supabase_anon_key_here'
        ? (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey)
        : null;
}
async function saveAnalysisToDB(record) {
    try {
        const supabase = getSupabaseClient();
        // If Supabase is not configured, return the record with a mock ID
        if (!supabase) {
            console.log('Supabase not configured, using mock storage');
            return {
                ...record,
                id: `mock_${Date.now()}`
            };
        }
        const { data, error } = await supabase
            .from('stock_analyses')
            .insert({
            symbol: record.symbol,
            analysis: record.analysis,
            stock_data: record.stockData,
            created_at: record.timestamp
        })
            .select()
            .single();
        if (error) {
            console.error('Error saving to Supabase:', error);
            throw error;
        }
        return {
            id: data.id,
            symbol: data.symbol,
            analysis: data.analysis,
            stockData: data.stock_data,
            timestamp: data.created_at
        };
    }
    catch (error) {
        console.error('Error in saveAnalysisToDB:', error);
        // Fallback to mock storage
        return {
            ...record,
            id: `fallback_${Date.now()}`
        };
    }
}
async function getAnalysisHistory(symbol) {
    try {
        const supabase = getSupabaseClient();
        // If Supabase is not configured, return mock history
        if (!supabase) {
            console.log('Supabase not configured, returning mock history');
            return getMockHistory(symbol);
        }
        const { data, error } = await supabase
            .from('stock_analyses')
            .select('*')
            .eq('symbol', symbol)
            .order('created_at', { ascending: false })
            .limit(10);
        if (error) {
            console.error('Error fetching from Supabase:', error);
            throw error;
        }
        return data.map((item) => ({
            id: item.id,
            symbol: item.symbol,
            analysis: item.analysis,
            stockData: item.stock_data,
            timestamp: item.created_at
        }));
    }
    catch (error) {
        console.error('Error in getAnalysisHistory:', error);
        // Fallback to mock history
        return getMockHistory(symbol);
    }
}
function getMockHistory(symbol) {
    const baseTime = new Date();
    return [
        {
            id: 'mock_1',
            symbol,
            analysis: {
                summary: 'Previous analysis showed strong fundamentals',
                sentiment: 'Bullish',
                riskLevel: 'Low',
                keyPoints: ['Strong revenue growth', 'Healthy margins', 'Market leadership'],
                recommendations: ['Hold for long term', 'Monitor quarterly earnings']
            },
            stockData: {
                symbol,
                name: 'Mock Company',
                price: 100,
                change: 1.5,
                changePercent: 1.5,
                volume: 1000000,
                marketCap: 1000000000,
                peRatio: 20,
                dividendYield: 2,
                high: 102,
                low: 98,
                open: 99,
                previousClose: 98.5,
                timestamp: new Date(baseTime.getTime() - 86400000).toISOString()
            },
            timestamp: new Date(baseTime.getTime() - 86400000).toISOString()
        },
        {
            id: 'mock_2',
            symbol,
            analysis: {
                summary: 'Initial analysis indicated moderate growth potential',
                sentiment: 'Neutral',
                riskLevel: 'Medium',
                keyPoints: ['Stable performance', 'Moderate growth', 'Competitive market'],
                recommendations: ['Consider for diversification', 'Set stop-loss orders']
            },
            stockData: {
                symbol,
                name: 'Mock Company',
                price: 95,
                change: -0.5,
                changePercent: -0.52,
                volume: 800000,
                marketCap: 950000000,
                peRatio: 18,
                dividendYield: 2.5,
                high: 97,
                low: 94,
                open: 96,
                previousClose: 95.5,
                timestamp: new Date(baseTime.getTime() - 172800000).toISOString()
            },
            timestamp: new Date(baseTime.getTime() - 172800000).toISOString()
        }
    ];
}
// SQL for creating the table in Supabase
exports.CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS stock_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol VARCHAR(10) NOT NULL,
  analysis JSONB NOT NULL,
  stock_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add indexes for better query performance
  INDEX idx_symbol (symbol),
  INDEX idx_created_at (created_at DESC)
);

-- Optional: Add RLS (Row Level Security) policies
ALTER TABLE stock_analyses ENABLE ROW LEVEL SECURITY;

-- Policy to allow all operations (adjust based on your needs)
CREATE POLICY "Allow all operations" ON stock_analyses
  FOR ALL USING (true);
`;
//# sourceMappingURL=dbService.js.map