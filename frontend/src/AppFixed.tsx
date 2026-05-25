import { useState } from 'react';
import { Search, TrendingUp, Brain, Database, Loader2, Sparkles, BarChart3, Percent, Users, DollarSign } from 'lucide-react';
import { analyzeStock, fetchStockData } from './services/api';
import type { AIAnalysis } from './types/analysis';
import type { StockData } from './types/stock';

function AppFixed() {
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const safeNumber = (value: unknown, fallback = 0) => {
    return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
  };

  const formatOptionalCurrency = (value: unknown) => {
    const numberValue = safeNumber(value);
    if (numberValue <= 0) return '暂无';
    return `$${numberValue.toLocaleString()}`;
  };

  const formatOptionalPercent = (value: unknown) => {
    const numberValue = safeNumber(value);
    if (numberValue <= 0) return '暂无';
    return `${numberValue.toFixed(2)}%`;
  };

  const getFallbackAnalysis = (stock: StockData): AIAnalysis => ({
    summary: `${stock.symbol} 当前价格为 $${safeNumber(stock.price).toFixed(2)}，日内波动 ${safeNumber(stock.changePercent).toFixed(2)}%。在接口不可用时，这里展示本地生成的分析结果，方便你确认按钮已经正常工作。`,
    sentiment: safeNumber(stock.changePercent) >= 1 ? 'Bullish' : safeNumber(stock.changePercent) <= -1 ? 'Bearish' : 'Neutral',
    riskLevel: 'Medium',
    keyPoints: [
      `当前价格: $${safeNumber(stock.price).toFixed(2)}`,
      `涨跌幅: ${safeNumber(stock.changePercent).toFixed(2)}%`,
      `成交量: ${safeNumber(stock.volume).toLocaleString()}`,
      `市值: $${safeNumber(stock.marketCap).toLocaleString()}`
    ],
    recommendations: [
      '如果接口不可用，先用本地结果验证交互',
      '后续再检查后端是否已启动并可访问',
      '接通 API 后可获得更完整的 AI 分析'
    ]
  });

  const isValidAnalysis = (value: unknown): value is AIAnalysis => {
    return Boolean(
      value &&
      typeof value === 'object' &&
      typeof (value as AIAnalysis).summary === 'string' &&
      typeof (value as AIAnalysis).sentiment === 'string' &&
      typeof (value as AIAnalysis).riskLevel === 'string'
    );
  };

  const handleStockSelect = async (symbol: string) => {
    setLoading(true);
    setError(null);
    try {
      const stockData = await fetchStockData(symbol);
      setSelectedStock(stockData);
      setAnalysis(null);
    } catch (err) {
      console.error('Error:', err);
      setError('获取股票数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedStock) return;

    setAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeStock(selectedStock.symbol, selectedStock);
      setAnalysis(isValidAnalysis(result) ? result : getFallbackAnalysis(selectedStock));
    } catch (err) {
      console.error('Analyze error:', err);
      setAnalysis(getFallbackAnalysis(selectedStock));
      setError('AI接口未连接，已切换为本地分析结果');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI股票分析面板</h1>
              <p className="text-gray-600 text-sm">使用人工智能分析股票数据</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          {error && (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
              {error}
            </div>
          )}

          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="输入股票代码 (例如: AAPL)"
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  handleStockSelect(e.currentTarget.value.toUpperCase());
                }
              }}
            />
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">热门股票</h3>
            <div className="flex flex-wrap gap-2">
              {['AAPL', 'GOOGL', 'MSFT', 'TSLA'].map((symbol) => (
                <button
                  key={symbol}
                  onClick={() => handleStockSelect(symbol)}
                  disabled={loading}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {symbol}
                </button>
              ))}
            </div>
          </div>
        </div>

        {selectedStock ? (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
              这是基础行情数据，不是 AI 分析结果。点击下面按钮后，才会生成 AI 分析。
            </div>

            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedStock.symbol}</h2>
                <p className="text-gray-600">{selectedStock.name}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">${safeNumber(selectedStock.price).toFixed(2)}</div>
                <div className={`flex items-center gap-1 ${safeNumber(selectedStock.changePercent) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="font-medium">
                    {(safeNumber(selectedStock.changePercent) >= 0 ? '+' : '')}{safeNumber(selectedStock.change).toFixed(2)} ({(safeNumber(selectedStock.changePercent) >= 0 ? '+' : '')}{safeNumber(selectedStock.changePercent).toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6 md:grid-cols-4">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-600">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  市值
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatOptionalCurrency(selectedStock.marketCap)}
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-600">
                  <BarChart3 className="h-4 w-4 text-gray-500" />
                  市盈率
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {safeNumber(selectedStock.peRatio) > 0 ? safeNumber(selectedStock.peRatio).toFixed(2) : '暂无'}
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-600">
                  <Percent className="h-4 w-4 text-gray-500" />
                  股息率
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatOptionalPercent(selectedStock.dividendYield)}
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-600">
                  <Users className="h-4 w-4 text-gray-500" />
                  成交量
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {safeNumber(selectedStock.volume) > 0 ? safeNumber(selectedStock.volume).toLocaleString() : '暂无'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full py-4 px-6 bg-blue-600 text-white rounded-xl font-medium text-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {analyzing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Brain className="w-6 h-6" />}
              {analyzing ? 'AI分析中...' : '使用AI分析此股票'}
            </button>

            {analysis ? (
              <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5">
                <div className="flex items-center gap-2 text-blue-700 font-semibold mb-3">
                  <Sparkles className="w-5 h-5" />
                  AI分析结果
                </div>
                <p className="text-gray-800 mb-3">{analysis.summary || '暂无分析摘要'}</p>
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="px-3 py-1 rounded-full bg-white text-gray-700 border border-blue-200">{analysis.sentiment || 'Unknown'}</span>
                  <span className="px-3 py-1 rounded-full bg-white text-gray-700 border border-blue-200">{analysis.riskLevel || 'Unknown'}</span>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5 text-sm text-gray-500">
                AI分析结果会显示在这里。
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">搜索股票开始分析</h3>
            <p className="text-gray-500">输入股票代码或从热门股票中选择</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            功能说明
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">实时数据</h4>
                <p className="text-sm text-gray-600">通过Alpha Vantage API获取实时股票数据</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Brain className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">AI分析</h4>
                <p className="text-sm text-gray-600">DeepSeek AI分析股票数据，提供投资建议</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Database className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">数据存储</h4>
                <p className="text-sm text-gray-600">分析结果自动保存到Supabase数据库</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 border-t border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-600 text-sm">
            <p>AI股票分析面板 © 2024 - 使用人工智能进行股票分析</p>
            <p className="mt-1">部署于 <span className="font-medium">Render.com</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AppFixed;
