"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeStockWithAI = analyzeStockWithAI;
const axios_1 = __importDefault(require("axios"));
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
async function analyzeStockWithAI(symbol, stockData) {
    try {
        const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
        // For demo purposes, return mock analysis if no API key
        if (!deepseekApiKey || deepseekApiKey === 'your_deepseek_api_key_here') {
            return getMockAnalysis(symbol, stockData);
        }
        const prompt = createAnalysisPrompt(symbol, stockData);
        const response = await axios_1.default.post(DEEPSEEK_API_URL, {
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content: '你是一名专业的金融分析师，专注于股票市场分析。请始终以指定的JSON格式响应。'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.3,
            max_tokens: 500,
            response_format: { type: 'json_object' }
        }, {
            headers: {
                'Authorization': `Bearer ${deepseekApiKey}`,
                'Content-Type': 'application/json'
            }
        });
        const content = response.data.choices[0].message.content;
        if (!content) {
            throw new Error('No response from AI');
        }
        const analysis = JSON.parse(content);
        // Validate the response format
        if (!analysis.summary || !analysis.sentiment || !analysis.riskLevel) {
            throw new Error('Invalid AI response format');
        }
        // Ensure sentiment is one of the allowed values
        const validSentiments = ['Bullish', 'Neutral', 'Bearish'];
        if (!validSentiments.includes(analysis.sentiment)) {
            analysis.sentiment = 'Neutral';
        }
        // Ensure risk level is one of the allowed values
        const validRiskLevels = ['Low', 'Medium', 'High'];
        if (!validRiskLevels.includes(analysis.riskLevel)) {
            analysis.riskLevel = 'Medium';
        }
        return analysis;
    }
    catch (error) {
        console.error('Error analyzing with AI:', error);
        // Fallback to mock analysis
        return getMockAnalysis(symbol, stockData);
    }
}
function createAnalysisPrompt(symbol, stockData) {
    return `请分析以下股票数据 ${symbol}，并以严格的JSON格式响应，包含以下字段：
1. summary: 股票表现和前景的简明总结（2-3句话）
2. sentiment: "Bullish"（看涨）、"Neutral"（中性）或"Bearish"（看跌）中的一个
3. riskLevel: "Low"（低）、"Medium"（中）或"High"（高）中的一个
4. keyPoints: 关于该股票的3-5个关键点数组
5. recommendations: 2-3个投资建议数组

股票数据：
- 公司: ${stockData.name}
- 当前价格: $${stockData.price}
- 涨跌: ${stockData.change} (${stockData.changePercent}%)
- 市值: $${stockData.marketCap.toLocaleString()}
- 市盈率: ${stockData.peRatio}
- 股息率: ${stockData.dividendYield}%
- 成交量: ${stockData.volume.toLocaleString()}
- 当日价格范围: $${stockData.low} - $${stockData.high}

请只返回有效的JSON，不要包含其他文本。`;
}
function getMockAnalysis(symbol, stockData) {
    const mockAnalyses = {
        'AAPL': {
            summary: '苹果公司展现出强劲的财务表现，收入持续增长，生态系统稳固。公司保持健康的利润率，并在消费电子领域持续创新。',
            sentiment: 'Bullish',
            riskLevel: 'Low',
            keyPoints: [
                '强大的品牌忠诚度和生态系统锁定',
                '持续的股息增长和股票回购',
                '服务业务板块显示高利润率增长',
                '创新管道包括AR/VR产品'
            ],
            recommendations: [
                '考虑长期持有适合增长型投资者',
                '监控供应链多元化努力',
                '关注新产品类别发布'
            ]
        },
        'GOOGL': {
            summary: 'Alphabet展示出稳健的广告收入增长，云业务不断扩张。公司保持强劲的现金流，并持续投资AI研究。',
            sentiment: 'Bullish',
            riskLevel: 'Medium',
            keyPoints: [
                '在搜索和数字广告领域占据主导地位',
                'Google云业务加速增长',
                '强大的AI研究能力',
                '监管审查仍是关注点'
            ],
            recommendations: [
                '适合增长导向的投资组合',
                '密切关注监管发展',
                '考虑定期定额投资策略'
            ]
        },
        'MSFT': {
            summary: '微软在企业软件领域占据主导地位，云采用率不断增长。公司在所有业务板块都显示出持续的收入增长。',
            sentiment: 'Bullish',
            riskLevel: 'Low',
            keyPoints: [
                'Azure云服务显示强劲增长',
                'Office 365保持高订阅率',
                '游戏部门受益于动视暴雪收购',
                '强大的企业客户关系'
            ],
            recommendations: [
                '科技投资组合的核心持仓',
                '监控云市场份额竞争',
                '考虑股息增长投资者'
            ]
        }
    };
    return mockAnalyses[symbol.toUpperCase()] || {
        summary: `${symbol}分析：该股票显示${stockData.changePercent >= 0 ? '积极' : '消极'}表现，当前价格为$${stockData.price}。`,
        sentiment: stockData.changePercent >= 1 ? 'Bullish' : stockData.changePercent <= -1 ? 'Bearish' : 'Neutral',
        riskLevel: 'Medium',
        keyPoints: [
            `当前价格: $${stockData.price}`,
            `日涨跌幅: ${stockData.changePercent}%`,
            `成交量: ${stockData.volume.toLocaleString()}`,
            `市值: $${stockData.marketCap.toLocaleString()}`
        ],
        recommendations: [
            '进行进一步的基本面分析',
            '监控市场趋势和新闻',
            '考虑技术分析寻找入场点'
        ]
    };
}
//# sourceMappingURL=aiService.js.map