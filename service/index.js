const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const DB = require('./database.js'); // 已经是老师风格的 database.js

const app = express();
const authCookieName = 'token';

// 服务端口，可通过命令行传入
const port = process.argv.length > 2 ? process.argv[2] : 3000;

//中间件
app.use(express.json());           // 解析 JSON 请求体
app.use(cookieParser());           // Cookie 解析
app.use(express.static(path.join(__dirname, 'dist'))); // 静态文件目录

// 工具函数 
function setAuthCookie(res, token) {
  res.cookie(authCookieName, token, {
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 年
    httpOnly: true,
    sameSite: 'strict',
  });
}

//  API 路由 
const apiRouter = express.Router();
app.use('/api', apiRouter);

//  用户注册 
apiRouter.post('/auth/signup', async (req, res) => {
  const { store, password } = req.body;
  if (!store || !password) return res.status(400).json({ msg: 'Missing store or password' });

  const existingUser = await DB.getUser(store);
  if (existingUser) return res.status(409).json({ msg: 'Store already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), store, password: hashedPassword, token: uuidv4() };
  await DB.addUser(user);

  setAuthCookie(res, user.token);
  res.json({ store: user.store });
});

//  用户登录
apiRouter.post('/auth/login', async (req, res) => {
  const { store, password } = req.body;
  const user = await DB.getUser(store);
  if (!user) return res.status(401).json({ msg: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ msg: 'Invalid credentials' });

  const token = uuidv4();
  await DB.updateUserToken(store, token);
  setAuthCookie(res, token);

  req.user = { id: user.id, store: user.store };
  res.json({ store: user.store });
});

//  用户登出 
apiRouter.delete('/auth/logout', async (req, res) => {
  const token = req.cookies[authCookieName];
  if (token) {
    const user = await DB.getUserByToken(token);
    if (user) await DB.updateUserToken(user.store, null);
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

//  授权中间件 
const verifyAuth = async (req, res, next) => {
  const token = req.cookies[authCookieName];
  if (!token) return res.status(401).json({ msg: 'Unauthorized' });

  const user = await DB.getUserByToken(token);
  if (!user) return res.status(401).json({ msg: 'Unauthorized' });

  req.user = { id: user.id, store: user.store };
  next();
};

//订单相关 API
apiRouter.post('/orders', verifyAuth, async (req, res) => {
  const { food, weather, transportTime } = req.body;
  if (!food || !weather || !transportTime) return res.status(400).json({ msg: 'Missing order data' });

  const order = { id: uuidv4(), food, weather, transportTime };
  await DB.addOrder(order);
  res.json(order);
});

apiRouter.get('/orders', verifyAuth, async (req, res) => {
  const orders = await DB.getOrders();
  res.json(orders);
});

// 测试 API 
apiRouter.get('/test', (req, res) => {
  res.json({ msg: 'Backend working' });
});

//  SPA 前端路由 
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

//  启动服务器 
app.listen(port, () => {
  console.log('Database connected!'); // 老师风格，数据库模块已经连接
  console.log(`Listening on port ${port}`);
});