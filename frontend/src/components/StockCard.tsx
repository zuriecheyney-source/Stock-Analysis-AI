import { TrendingUp, TrendingDown, DollarSign, BarChart3, Users, Percent, Calendar, Brain } from 'lucide-react';
import type { StockData } from '../types/stock';

interface StockCardProps {
  stock: StockData;
  onAnalyze: () => void;
  analyzing: boolean;
  hasAnalysis: boolean;
}

const StockCard = ({ stock, onAnalyze, analyzing, hasAnalysis }: StockCardProps) => {
  const isPositive = stock.changePercent >= 0;
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(stock.price);

  const formattedMarketCap = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(stock.marketCap);

  const formattedVolume = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(stock.volume);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${isPositive ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                {isPositive ? (
                  <TrendingUp className={`w-6 h-6 ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
                ) : (
                  <TrendingDown className={`w-6 h-6 ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stock.symbol}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {stock.name}
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {formattedPrice}
            </div>
            <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="font-medium">
                {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">市值</span>
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {formattedMarketCap}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">P/E比率</span>
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {stock.peRatio.toFixed(2)}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Percent className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">股息率</span>
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {stock.dividendYield.toFixed(2)}%
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">成交量</span>
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {formattedVolume}
            </div>
          </div>
        </div>

        {/* Price Range */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">今日价格范围</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">开盘价</span>
              <span className="font-medium text-gray-900 dark:text-white">
                ${stock.open.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">最高价</span>
              <span className="font-medium text-gray-900 dark:text-white">
                ${stock.high.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">最低价</span>
              <span className="font-medium text-gray-900 dark:text-white">
                ${stock.low.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">前收盘价</span>
              <span className="font-medium text-gray-900 dark:text-white">
                ${stock.previousClose.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button
            onClick={onAnalyze}
            disabled={analyzing}
            className={`w-full py-4 px-6 rounded-xl font-medium text-lg transition-all flex items-center justify-center gap-3 ${
              hasAnalysis 
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Brain className="w-6 h-6" />
            {analyzing ? (
              <>
                <span>AI分析中...</span>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
              </>
            ) : hasAnalysis ? (
              '重新分析'
            ) : (
              '使用AI分析此股票'
            )}
          </button>
          
          <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 text-center">
            <div className="flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>数据更新时间: {new Date(stock.timestamp).toLocaleString('zh-CN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockCard;