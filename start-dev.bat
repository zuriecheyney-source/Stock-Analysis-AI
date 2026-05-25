@echo off
echo 启动AI股票分析面板开发环境...
echo.

echo 1. 启动后端服务器...
cd backend
start cmd /k "npm run dev"
cd ..

echo 2. 启动前端开发服务器...
cd frontend
start cmd /k "npm run dev"
cd ..

echo.
echo 开发环境已启动！
echo 后端: http://localhost:3001
echo 前端: http://localhost:5173
echo.
echo 按任意键退出...
pause > nul