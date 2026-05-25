import { History, Calendar, TrendingUp, TrendingDown, Minus, Database, Clock } from 'lucide-react';
import type { AIAnalysis } from '../types/analysis';

interface HistoryItem {
  id: string;
  symbol: string;
  analysis: AIAnalysis;
  timestamp: string;
}

interface HistoryPanelProps {
  history: HistoryItem[];
}

const HistoryPanel = ({ history }: HistoryPanelProps) => {
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'Bullish':
        return <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'Bearish':
        return <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300';
      case 'Medium':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300';
      default:
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}分钟前`;
    } else if (diffHours < 24) {
      return `${diffHours}小时前`;
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <History className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                分析历史
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                最近的分析记录
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
            <Database className="w-4 h-4" />
            <span>Supabase</span>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="p-4">
        {history.length === 0 ? (
          <div className="text-center py-8">
            <History className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">
              暂无分析历史
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              开始分析股票后，记录将显示在这里
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {item.symbol}
                    </span>
                    <div className="flex items-center gap-1">
                      {getSentimentIcon(item.analysis.sentiment)}
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {item.analysis.sentiment}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(item.analysis.riskLevel)}`}>
                    {item.analysis.riskLevel}
                  </span>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">
                  {item.analysis.summary}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(item.timestamp)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(item.timestamp).toLocaleDateString('zh-CN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>分析历史自动保存到Supabase数据库</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              最多显示最近5条记录
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPanel;