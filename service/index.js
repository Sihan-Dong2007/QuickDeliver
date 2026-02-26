const express = require('express');
const app = express();

// 允许解析 JSON
app.use(express.json());

// 端口 4000
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// 测试接口
app.get('/api/test', (req, res) => {
  res.send({ msg: 'Backend working' });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});