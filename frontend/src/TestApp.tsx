function TestApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>测试页面</h1>
      <p>如果这个页面能显示，说明React工作正常。</p>
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <h2>测试信息</h2>
        <ul>
          <li>运行环境: {import.meta.env.MODE}</li>
          <li>时间: {new Date().toLocaleString()}</li>
          <li>环境: {import.meta.env.MODE}</li>
        </ul>
      </div>
    </div>
  );
}

export default TestApp;