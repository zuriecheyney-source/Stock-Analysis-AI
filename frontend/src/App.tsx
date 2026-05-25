import { useState } from 'react';
import { Search, TrendingUp, Brain, Database, AlertCircle } from 'lucide-react';
import StockSearch from './components/StockSearch';
import StockCard from './components/StockCard';
import AnalysisPanel from './components/AnalysisPanel';
import HistoryPanel from './components/HistoryPanel';
import type { StockData } from './types/stock';
import type { AIAnalysis } from './types/analysis';
import { fetchStockData, analyzeStock } from './services/api';

function App() {
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  const handleStockSelect = async (symbol: string) => {
    setLoading(true);
    setError(null);
    try {
      const stockData = await fetchStockData(symbol);
      setSelectedStock(stockData);
      setAnalysis(null); // Clear previous analysis
    } catch (err: any) {
      setError(err.message || 'Failed to fetch stock data');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedStock) return;
    
    setAnalyzing(true);
    setError(null);
    try {
      const analysisResult = await analyzeStock(selectedStock.symbol, selectedStock);
      setAnalysis(analysisResult);
      
      // Add to history
      setHistory(prev => [{
        id: Date.now(),
        symbol: selectedStock.symbol,
        analysis: analysisResult,
        timestamp: new Date().toISOString()
      }, ...prev.slice(0, 4)]);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze stock');
    } finally {
      setAnalyzing(false);
    }
  };

  const popularStocks = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA', 'META', 'NFLX'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                <TrendingUp className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  AI股票分析面板
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  使用人工智能分析股票数据，提供投资建议
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Database className="w-4 h-4" />
              <span>Supabase存储</span>
              <span className="mx-2">•</span>
              <Brain className="w-4 h-4" />
              <span>AI分析</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <StockSearch onStockSelect={handleStockSelect} loading={loading} />
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Popular Stocks */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">热门股票</h3>
            <div className="flex flex-wrap gap-2">
              {popularStocks.map(symbol => (
                <button
                  key={symbol}
                  onClick={() => handleStockSelect(symbol)}
                  disabled={loading}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {symbol}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stock Data */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stock Card */}
            {selectedStock ? (
              <StockCard 
                stock={selectedStock} 
                onAnalyze={handleAnalyze}
                analyzing={analyzing}
                hasAnalysis={!!analysis}
              />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
                <Search className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  搜索股票开始分析
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  输入股票代码或从热门股票中选择
                </p>
              </div>
            )}

            {/* Analysis Panel */}
            {analysis && (
              <AnalysisPanel analysis={analysis} />
            )}
          </div>

          {/* Right Column - History & Info */}
          <div className="space-y-8">
            {/* History Panel */}
            <HistoryPanel history={history} />

            {/* Info Panel */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                功能说明
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">实时数据</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      通过Alpha Vantage API获取实时股票数据
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Brain className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">AI分析</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      DeepSeek AI分析股票数据，提供投资建议
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Database className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">数据存储</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      分析结果自动保存到Supabase数据库
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">技术栈</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full">
                    React + TypeScript
                  </span>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs font-medium rounded-full">
                    Node.js + Express
                  </span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 text-xs font-medium rounded-full">
                    Supabase
                  </span>
                  <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 text-xs font-medium rounded-full">
                    DeepSeek AI
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              <p>AI股票分析面板 © 2024 - 使用人工智能进行股票分析</p>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-500">
              <p>部署于 <span className="font-medium">Render.com</span></p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;