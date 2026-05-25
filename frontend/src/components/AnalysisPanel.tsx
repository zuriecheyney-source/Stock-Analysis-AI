import { Brain, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Minus, Shield, AlertCircle, Lightbulb } from 'lucide-react';
import type { AIAnalysis } from '../types/analysis';

interface AnalysisPanelProps {
  analysis: AIAnalysis;
}

const AnalysisPanel = ({ analysis }: AnalysisPanelProps) => {
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'Bullish':
        return <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'Bearish':
        return <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />;
      default:
        return <Minus className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Bullish':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300';
      case 'Bearish':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300';
      default:
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low':
        return <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'Medium':
        return <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
            <Brain className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              AI分析结果
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              基于DeepSeek AI的深度分析
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Summary */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            分析总结
          </h3>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {analysis.summary}
            </p>
          </div>
        </div>

        {/* Sentiment & Risk */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Sentiment */}
          <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              {getSentimentIcon(analysis.sentiment)}
              <h4 className="font-semibold text-gray-900 dark:text-white">市场情绪</h4>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getSentimentColor(analysis.sentiment)}`}>
              {getSentimentIcon(analysis.sentiment)}
              <span className="font-medium">{analysis.sentiment}</span>
            </div>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              {analysis.sentiment === 'Bullish' 
                ? '市场情绪积极，预期价格上涨'
                : analysis.sentiment === 'Bearish'
                ? '市场情绪消极，预期价格下跌'
                : '市场情绪中性，预期价格稳定'}
            </p>
          </div>

          {/* Risk Level */}
          <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              {getRiskIcon(analysis.riskLevel)}
              <h4 className="font-semibold text-gray-900 dark:text-white">风险等级</h4>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getRiskColor(analysis.riskLevel)}`}>
              {getRiskIcon(analysis.riskLevel)}
              <span className="font-medium">{analysis.riskLevel}</span>
            </div>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              {analysis.riskLevel === 'Low'
                ? '投资风险较低，适合保守型投资者'
                : analysis.riskLevel === 'Medium'
                ? '投资风险中等，适合平衡型投资者'
                : '投资风险较高，适合激进型投资者'}
            </p>
          </div>
        </div>

        {/* Key Points */}
        {analysis.keyPoints && analysis.keyPoints.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">关键要点</h3>
            <div className="space-y-3">
              {analysis.keyPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">{point}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {analysis.recommendations && analysis.recommendations.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">投资建议</h3>
            <div className="space-y-3">
              {analysis.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-primary-50 dark:bg-primary-900/30 rounded-lg border border-primary-200 dark:border-primary-800">
                  <Lightbulb className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Brain className="w-4 h-4" />
            <span>分析由DeepSeek AI生成，仅供参考，不构成投资建议</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPanel;