#!/bin/bash

echo "启动AI股票分析面板开发环境..."
echo ""

echo "1. 启动后端服务器..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

echo "2. 启动前端开发服务器..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "开发环境已启动！"
echo "后端: http://localhost:3001"
echo "前端: http://localhost:5173"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 捕获退出信号
trap 'kill $BACKEND_PID $FRONTEND_PID; exit' INT

# 等待用户中断
wait