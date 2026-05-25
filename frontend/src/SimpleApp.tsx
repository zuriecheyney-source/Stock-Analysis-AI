function SimpleApp() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">AI股票分析面板</h1>
          <p className="text-gray-600 mt-2">简化测试版本</p>
        </header>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">功能测试</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800">Tailwind CSS测试</h3>
              <p className="text-blue-600 mt-1">如果这个框有蓝色背景，说明Tailwind CSS工作正常。</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-800">响应式设计测试</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div className="p-3 bg-green-100 rounded text-center">列1</div>
                <div className="p-3 bg-green-200 rounded text-center">列2</div>
                <div className="p-3 bg-green-300 rounded text-center">列3</div>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-purple-800">交互测试</h3>
              <button className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">
                点击测试按钮
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-center text-gray-500 text-sm">
          <p>服务器时间: {new Date().toLocaleString()}</p>
          <p className="mt-2">如果这个页面正常显示，说明前端基础功能正常。</p>
        </div>
      </div>
    </div>
  );
}

export default SimpleApp;