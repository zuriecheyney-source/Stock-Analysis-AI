# AI股票分析面板 - 设置指南

## 项目概述
这是一个全栈AI股票分析应用，使用React前端、Node.js后端、Supabase数据库和DeepSeek AI进行股票分析。

## 环境变量配置

### 后端配置 (backend/.env)
复制 `.env.example` 到 `.env` 并填写以下值：

```env
# API Keys
DEEPSEEK_API_KEY=your_deepseek_api_key_here
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here

# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Server Configuration
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

### 前端配置 (frontend/.env)
创建 `.env` 文件：

```env
VITE_API_URL=http://localhost:3001/api
```

## API密钥获取

### 1. DeepSeek API
1. 访问 [DeepSeek Platform](https://platform.deepseek.com/)
2. 注册账号并登录
3. 进入 API Keys 页面
4. 点击 "创建新的API密钥"
5. 复制生成的API密钥（DeepSeek提供免费额度）

### 2. Alpha Vantage API (免费)
1. 访问 [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. 注册免费账号
3. 获取API密钥（每天100次请求限制）

### 3. Supabase 数据库
1. 访问 [Supabase](https://supabase.com/)
2. 注册账号并创建新项目
3. 获取项目URL和anon key
4. 运行 `supabase-setup.sql` 创建表结构

## 本地开发

### 启动后端
```bash
cd backend
npm install
npm run dev
```

### 启动前端
```bash
cd frontend
npm install
npm run dev
```

## 部署到 Render.com

### 1. 创建GitHub仓库
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/stock-analysis.git
git push -u origin main
```

### 2. 部署到Render
1. 登录 [Render.com](https://render.com/)
2. 点击 "New +" → "Blueprint"
3. 连接GitHub仓库
4. Render会自动检测 `render.yaml` 并部署两个服务

### 3. 配置环境变量
在Render Dashboard中为每个服务配置环境变量：

**后端服务环境变量：**
- `DEEPSEEK_API_KEY`
- `ALPHA_VANTAGE_API_KEY`
- `SUPABASE_URL`（填写 Supabase 项目 URL，例如 `https://your-project-ref.supabase.co`，不要带 `/rest/v1`）
- `SUPABASE_ANON_KEY`
- `NODE_ENV=production`
- `PORT=3001`
- `CORS_ORIGIN=https://your-frontend-url.onrender.com`

**前端服务环境变量：**
- `VITE_API_URL=https://your-backend-url.onrender.com/api`

## 项目结构

```
stock-analysis/
├── frontend/                 # React前端
│   ├── src/
│   │   ├── components/      # React组件
│   │   ├── services/       # API服务
│   │   ├── types/         # TypeScript类型
│   │   └── App.tsx        # 主应用
│   └── package.json
├── backend/                 # Node.js后端
│   ├── src/
│   │   ├── routes/        # API路由
│   │   ├── services/      # 业务逻辑
│   │   └── index.ts       # 服务器入口
│   └── package.json
├── render.yaml             # Render部署配置
├── supabase-setup.sql     # 数据库初始化
└── SETUP.md              # 本文件
```

## 功能特性

### 1. 股票数据获取
- 实时股票价格和基本信息
- 技术指标（P/E比率、股息率等）
- 交易量和市值数据

### 2. AI分析
- 使用OpenAI GPT进行深度分析
- 市场情绪分析（Bullish/Neutral/Bearish）
- 风险等级评估（Low/Medium/High）
- 投资建议和关键要点

### 3. 数据存储
- 分析结果保存到Supabase
- 历史记录查看
- 数据持久化

### 4. 用户界面
- 响应式设计，支持移动端
- 实时数据更新
- 直观的图表和指标显示

## 故障排除

### 常见问题

1. **API密钥无效**
   - 检查API密钥是否正确
   - 确认API服务是否可用
   - 检查API调用限制

2. **数据库连接失败**
   - 检查Supabase连接配置
   - 确认网络连接
   - 验证数据库表结构

3. **CORS错误**
   - 检查后端CORS配置
   - 确认前端API URL正确
   - 验证环境变量

4. **部署问题**
   - 检查Render日志
   - 验证环境变量配置
   - 确认构建过程无错误

### 调试建议

1. 检查控制台日志
2. 验证API响应
3. 测试数据库连接
4. 检查网络请求

## 安全注意事项

1. **API密钥安全**
   - 不要将API密钥提交到版本控制
   - 使用环境变量管理密钥
   - 定期轮换密钥

2. **数据库安全**
   - 使用Row Level Security
   - 限制数据库访问权限
   - 定期备份数据

3. **应用安全**
   - 实施输入验证
   - 使用HTTPS
   - 设置适当的CORS策略

## 扩展功能建议

1. **技术分析**
   - 添加技术指标图表
   - 支持多种时间框架
   - 技术信号检测

2. **投资组合管理**
   - 多股票跟踪
   - 投资组合分析
   - 业绩报告

3. **通知系统**
   - 价格提醒
   - 分析更新通知
   - 市场新闻推送

4. **高级功能**
   - 机器学习预测
   - 情感分析整合
   - 自定义分析模板