# AI股票分析面板

一个使用人工智能分析股票数据的全栈应用，提供实时股票数据获取、AI深度分析和数据存储功能。

## 🚀 功能特性

### 📈 股票数据
- 实时股票价格和基本信息
- 技术指标（P/E比率、股息率、市值等）
- 交易数据和价格范围
- 热门股票快速访问

### 🤖 AI分析
- 使用DeepSeek AI进行深度分析
- 市场情绪分析（看涨/中性/看跌）
- 风险等级评估（低/中/高）
- 投资建议和关键要点
- 严格JSON格式响应

#### Prompt 设计：强制 LLM 只输出 JSON

后端在 `backend/src/services/aiService.ts` 里同时使用系统提示词、结构化用户提示词和 `response_format`，避免模型乱说话：

```ts
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
```

`prompt` 本身会再次明确字段结构，并要求只返回 JSON：

```ts
return `请分析以下股票数据 ${symbol}，并以严格的JSON格式响应，包含以下字段：
1. summary
2. sentiment
3. riskLevel
4. keyPoints
5. recommendations

请只返回有效的JSON，不要包含其他文本。`;
```

### 💾 数据存储
- Supabase PostgreSQL数据库
- 分析历史记录保存
- 数据持久化和查询

### 🎨 用户界面
- 现代化响应式设计
- 实时数据可视化
- 直观的操作流程
- 支持深色模式

## 🛠️ 技术栈

### 前端
- React 18 + TypeScript
- Tailwind CSS
- Vite构建工具
- Axios HTTP客户端

### 后端
- Node.js + Express
- TypeScript
- DeepSeek AI API
- Alpha Vantage股票API

### 数据库
- Supabase (PostgreSQL)
- Row Level Security
- JSONB数据存储

### 部署
- Render.com
- 自动CI/CD
- 环境变量管理

## 📋 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/yourusername/stock-analysis.git
cd stock-analysis
```

### 2. 配置环境变量
参考 [SETUP.md](./SETUP.md) 配置API密钥和数据库连接。

### 3. 安装依赖
```bash
# 后端
cd backend
npm install

# 前端
cd ../frontend
npm install
```

### 4. 启动开发服务器
```bash
# 后端 (端口: 3001)
cd backend
npm run dev

# 前端 (端口: 5173)
cd frontend
npm run dev
```

### 5. 访问应用
打开浏览器访问：http://localhost:5173

## 🔧 配置说明

### API密钥需求
1. **DeepSeek API密钥** - 用于AI分析（提供免费额度）
2. **Alpha Vantage API密钥** - 用于股票数据（免费）
3. **Supabase配置** - 数据库URL和匿名密钥

### 环境变量
详细配置请查看 [SETUP.md](./SETUP.md)

## 🚢 部署

### Render.com 部署
项目包含 `render.yaml` 配置文件，支持一键部署到Render.com：

1. 推送代码到GitHub仓库
2. 在Render.com导入Blueprint
3. 配置环境变量
4. 自动部署完成

### 自定义部署
- 前端：静态文件托管
- 后端：Node.js服务器
- 数据库：Supabase或自建PostgreSQL

### 在线访问

已部署到 Render，可直接访问：

- 前端地址: https://stock-analysis-ai-1.onrender.com
- 后端 API: https://stock-analysis-ai-s6q7.onrender.com/api

本地开发地址：

- 前端: http://localhost:5173
- 后端: http://localhost:3001/api

## 📁 项目结构

```
stock-analysis/
├── frontend/                 # React前端应用
│   ├── src/
│   │   ├── components/      # React组件
│   │   │   ├── StockSearch.tsx
│   │   │   ├── StockCard.tsx
│   │   │   ├── AnalysisPanel.tsx
│   │   │   └── HistoryPanel.tsx
│   │   ├── services/       # API服务
│   │   ├── types/         # TypeScript类型定义
│   │   └── App.tsx        # 主应用组件
│   ├── public/            # 静态资源
│   └── package.json
├── backend/                 # Node.js后端服务
│   ├── src/
│   │   ├── routes/        # API路由
│   │   │   ├── stockRoutes.ts
│   │   │   └── analysisRoutes.ts
│   │   ├── services/      # 业务逻辑
│   │   │   ├── stockService.ts
│   │   │   ├── aiService.ts
│   │   │   └── dbService.ts
│   │   └── index.ts       # 服务器入口
│   ├── package.json
│   └── tsconfig.json
├── render.yaml             # Render部署配置
├── supabase-setup.sql     # 数据库初始化脚本
├── SETUP.md              # 详细设置指南
└── README.md             # 本文件
```

## 🔍 API接口

### 股票数据
- `GET /api/stocks/:symbol` - 获取股票数据
- `GET /api/stocks/search/:query` - 搜索股票

### AI分析
- `POST /api/analysis/analyze` - 分析股票
- `GET /api/analysis/history/:symbol` - 获取分析历史

### 健康检查
- `GET /api/health` - 服务健康状态

## 🎯 使用示例

1. **搜索股票** - 输入股票代码（如AAPL）
2. **查看数据** - 显示实时价格和指标
3. **AI分析** - 点击"使用AI分析"按钮
4. **查看结果** - 获取分析总结、情绪和风险
5. **保存历史** - 分析结果自动保存

## 🔒 安全特性

- 环境变量管理敏感信息
- CORS策略配置
- 输入验证和错误处理
- 数据库行级安全
- API密钥加密存储

## 🛠 Debug 记录

示例：我曾用 AI 工具排查过一次 CORS 问题。最初前端请求后端时失败，后来定位到后端只放行了 `localhost:5173`，而 Vite 实际运行在 `5175`。我把开发环境的本机端口放宽后，前端立刻恢复正常访问。

排查路径：

1. 先用浏览器和接口测试确认问题不是数据解析报错。
2. 再看后端日志和 CORS 配置，确认是 Origin 被拦截。
3. 最后修改 `backend/src/index.ts`，允许 `localhost` / `127.0.0.1` 的任意开发端口，问题解决。

## 📊 数据流

```
用户输入 → 前端请求 → 后端API → 股票数据API → AI分析 → 数据库存储 → 前端显示
```

## 🤝 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 📝 许可证

MIT License

## 🙏 致谢

- [DeepSeek](https://deepseek.com/) - AI API（提供免费额度）
- [Alpha Vantage](https://www.alphavantage.co/) - 免费股票API
- [Supabase](https://supabase.com/) - 开源Firebase替代
- [Render](https://render.com/) - 云部署平台

## 📞 支持

如有问题或建议，请提交Issue或联系维护者。

---

**注意**：本工具提供的信息仅供参考，不构成投资建议。投资有风险，决策需谨慎。
