export interface AIAnalysis {
  summary: string;
  sentiment: 'Bullish' | 'Neutral' | 'Bearish';
  riskLevel: 'Low' | 'Medium' | 'High';
  keyPoints?: string[];
  recommendations?: string[];
}

export interface AnalysisHistory {
  id: string;
  symbol: string;
  analysis: AIAnalysis;
  timestamp: string;
}