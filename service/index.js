const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const DB = require('./database.js'); // 你的 database.js（已改为标准封装版本）

const app = express();
const authCookieName = 'token';

// 服务端口，可通过命令行传入
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// ================== 中间件 ==================
app.use(express.json());           // 解析 JSON 请求体
app.use(cookieParser());           // Cookie 解析
app.use(express.static(path.join(__dirname, 'dist'))); // React 打包的静态文件

// ================== API 路由 ==================
const apiRouter = express.Router();
app.use('/api', apiRouter);

// -------- 工具函数：设置 cookie --------
function setAuthCookie(res, token) {
  res.cookie(authCookieName, token, {
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 年
    httpOnly: true,
    sameSite: 'strict',
  });
}

// ================== 用户路由 (/api/auth) ==================
const authRouter = express.Router();
apiRouter.use('/auth', authRouter);

// 用户注册
authRouter.post('/signup', async (req, res) => {
  const { store, password } = req.body;
  if (!store || !password) return res.status(400).json({ msg: 'Missing store or password' });

  const existingUser = await DB.getUser({ store });
  if (existingUser) return res.status(409).json({ msg: 'Store already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), store, password: hashedPassword, token: uuidv4() };

  await DB.addUser(user);
  setAuthCookie(res, user.token);
  res.json({ store: user.store });
});

// 用户登录
authRouter.post('/login', async (req, res) => {
  const { store, password } = req.body;
  const user = await DB.getUser({ store });
  if (!user) return res.status(401).json({ msg: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ msg: 'Invalid credentials' });

  const token = uuidv4();
  await DB.updateUser({ store }, { token });
  setAuthCookie(res, token);
  res.json({ store: user.store });
});

// 用户登出
authRouter.delete('/logout', async (req, res) => {
  const token = req.cookies[authCookieName];
  if (token) {
    const user = await DB.getUser({ token });
    if (user) await DB.updateUser({ store: user.store }, { token: null });
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// ================== 授权中间件 ==================
async function verifyAuth(req, res, next) {
  const token = req.cookies[authCookieName];
  if (!token) return res.status(401).json({ msg: 'Unauthorized' });

  const user = await DB.getUser({ token });
  if (!user) return res.status(401).json({ msg: 'Unauthorized' });

  req.user = user; // 可选：把用户信息挂在 req 上
  next();
}

// ================== 订单路由 (/api/orders) ==================
const ordersRouter = express.Router();
apiRouter.use('/orders', ordersRouter);

// 创建订单
ordersRouter.post('/', verifyAuth, async (req, res) => {
  const { food, weather, transportTime } = req.body;
  if (!food || !weather || !transportTime) return res.status(400).json({ msg: 'Missing order data' });

  const order = { id: uuidv4(), food, weather, transportTime };
  await DB.addOrder(order);
  res.json(order);
});

// 获取订单
ordersRouter.get('/', verifyAuth, async (req, res) => {
  const orders = await DB.getOrders();
  res.json(orders);
});

// ================== 测试 API ==================
apiRouter.get('/test', (req, res) => {
  res.json({ msg: 'Backend working' });
});

// ================== SPA 前端路由 ==================
// React 前端所有路由都返回 index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ================== 启动服务器 ==================
(async () => {
  try {
    await DB.connectDB(); // 确保数据库已连接
    console.log('Database connected!');

    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to connect DB:', err);
    process.exit(1); // PM2 会自动重启
  }
})();