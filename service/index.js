const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

// 允许解析 JSON
app.use(express.json());
app.use(cookieParser());

// 临时用户存储（后面可以换数据库）
let users = [];

// 注册接口
app.post('/api/signup', async (req, res) => {
  const { store, password } = req.body;

  if (!store || !password) {
    return res.status(400).json({ msg: 'Missing store or password' });
  }

  // 检查是否已存在
  if (users.find(u => u.store === store)) {
    return res.status(409).json({ msg: 'Store already exists' });
  }

  // 加密密码
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: uuidv4(),
    store,
    password: hashedPassword,
    token: uuidv4(),
  };


  users.push(newUser);

  res.cookie('token', newUser.token, {
  httpOnly: true,
  sameSite: 'strict',
  });

  res.json({ store: newUser.store });
});

app.post('/api/login', async (req, res) => {
  const { store, password } = req.body;

  const user = users.find(u => u.store === store);

  if (!user) {
    return res.status(401).json({ msg: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return res.status(401).json({ msg: 'Invalid credentials' });
  }

  user.token = uuidv4();

  res.cookie('token', user.token, {
    httpOnly: true,
    sameSite: 'strict',
  });

  res.json({ store: user.store });
});

app.delete('/api/logout', (req, res) => {
  const token = req.cookies.token;

  const user = users.find(u => u.token === token);

  if (user) {
    user.token = null;
  }

  res.clearCookie('token');
  res.status(204).end();
});

function verifyAuth(req, res, next) {
  const token = req.cookies.token;

  const user = users.find(u => u.token === token);

  if (!user) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  next();
}

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