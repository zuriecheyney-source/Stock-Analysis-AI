-- Create stock_analyses table
CREATE TABLE IF NOT EXISTS stock_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol VARCHAR(10) NOT NULL,
  analysis JSONB NOT NULL,
  stock_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_stock_analyses_symbol ON stock_analyses(symbol);
CREATE INDEX IF NOT EXISTS idx_stock_analyses_created_at ON stock_analyses(created_at DESC);

-- Enable Row Level Security
ALTER TABLE stock_analyses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust based on your needs)
CREATE POLICY "Allow all operations" ON stock_analyses
  FOR ALL USING (true);

-- Create a view for recent analyses
CREATE OR REPLACE VIEW recent_analyses AS
SELECT 
  symbol,
  analysis->>'sentiment' as sentiment,
  analysis->>'riskLevel' as risk_level,
  created_at
FROM stock_analyses
ORDER BY created_at DESC
LIMIT 100;

-- Create a function to get analysis statistics
CREATE OR REPLACE FUNCTION get_analysis_stats(symbol_param VARCHAR)
RETURNS TABLE (
  total_analyses BIGINT,
  bullish_count BIGINT,
  bearish_count BIGINT,
  neutral_count BIGINT,
  latest_analysis_date TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_analyses,
    COUNT(CASE WHEN analysis->>'sentiment' = 'Bullish' THEN 1 END) as bullish_count,
    COUNT(CASE WHEN analysis->>'sentiment' = 'Bearish' THEN 1 END) as bearish_count,
    COUNT(CASE WHEN analysis->>'sentiment' = 'Neutral' THEN 1 END) as neutral_count,
    MAX(created_at) as latest_analysis_date
  FROM stock_analyses
  WHERE symbol = symbol_param;
END;
$$ LANGUAGE plpgsql;