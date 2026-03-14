const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const {
  connectDB,
  addUser,
  getUser,
  updateUserToken,
  addOrder,
  getOrders,
} = require('./database');

const app = express();
app.use(express.json());
app.use(cookieParser());

let db;

// 初始化数据库
async function initDB() {
  db = await connectDB();
}
initDB();

// SIGNUP
app.post('/api/signup', async (req, res) => {
  const { store, password } = req.body;
  if (!store || !password) return res.status(400).json({ msg: 'Missing store or password' });

  const existingUser = await getUser(store);
  if (existingUser) return res.status(409).json({ msg: 'Store already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: uuidv4(), store, password: hashedPassword, token: uuidv4() };

  await addUser(newUser);

  res.cookie('token', newUser.token, { httpOnly: true, sameSite: 'strict' });
  res.json({ store: newUser.store });
});

// LOGIN
app.post('/api/login', async (req, res) => {
  const { store, password } = req.body;
  const user = await getUser(store);
  if (!user) return res.status(401).json({ msg: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ msg: 'Invalid credentials' });

  const token = uuidv4();
  await updateUserToken(store, token);

  res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });
  res.json({ store: user.store });
});

// LOGOUT
app.delete('/api/logout', async (req, res) => {
  const token = req.cookies.token;
  if (token) {
    const user = await db.collection('users').findOne({ token });
    if (user) await updateUserToken(user.store, null);
  }
  res.clearCookie('token');
  res.status(204).end();
});

// AUTH MIDDLEWARE
async function verifyAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ msg: 'Unauthorized' });

  const user = await db.collection('users').findOne({ token });
  if (!user) return res.status(401).json({ msg: 'Unauthorized' });

  next();
}

// CREATE ORDER
app.post('/api/orders', verifyAuth, async (req, res) => {
  const { food, weather, transportTime } = req.body;
  if (!food || !weather || !transportTime) return res.status(400).json({ msg: 'Missing order data' });

  const newOrder = { id: uuidv4(), food, weather, transportTime };
  await addOrder(newOrder);
  res.json(newOrder);
});

// GET ORDERS
app.get('/api/orders', verifyAuth, async (req, res) => {
  const orders = await getOrders();
  res.json(orders);
});

// TEST API
app.get('/api/test', (req, res) => {
  res.json({ msg: 'Backend working' });
});

// STATIC FRONTEND
const path = require('path');

app.use(express.static(path.join(__dirname, 'dist'))); // serve dist 文件夹

// 所有未匹配的请求都返回 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// START SERVER
const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
