const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path'); // 新增

const { connectDB } = require('./database'); // 之前改好的数据库连接

const app = express();
app.use(express.json());
app.use(cookieParser());

// 数据存储（改成从数据库后续替换）
let users = [];
let orders = [];

// SIGNUP
app.post('/api/signup', async (req, res) => {
  const { store, password } = req.body;
  if (!store || !password) return res.status(400).json({ msg: 'Missing store or password' });

  if (users.find(u => u.store === store)) return res.status(409).json({ msg: 'Store already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: uuidv4(), store, password: hashedPassword, token: uuidv4() };

  users.push(newUser);

  res.cookie('token', newUser.token, { httpOnly: true, sameSite: 'strict' });
  res.json({ store: newUser.store });
});

// LOGIN
app.post('/api/login', async (req, res) => {
  const { store, password } = req.body;
  const user = users.find(u => u.store === store);
  if (!user) return res.status(401).json({ msg: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ msg: 'Invalid credentials' });

  user.token = uuidv4();
  res.cookie('token', user.token, { httpOnly: true, sameSite: 'strict' });
  res.json({ store: user.store });
});

// LOGOUT
app.delete('/api/logout', (req, res) => {
  const token = req.cookies.token;
  const user = users.find(u => u.token === token);
  if (user) user.token = null;

  res.clearCookie('token');
  res.status(204).end();
});

// AUTH MIDDLEWARE
function verifyAuth(req, res, next) {
  const token = req.cookies.token;
  const user = users.find(u => u.token === token);
  if (!user) return res.status(401).json({ msg: 'Unauthorized' });
  next();
}

// CREATE ORDER
app.post('/api/orders', verifyAuth, (req, res) => {
  const { food, weather, transportTime } = req.body;
  if (!food || !weather || !transportTime) return res.status(400).json({ msg: 'Missing order data' });

  const newOrder = { id: uuidv4(), food, weather, transportTime };
  orders.push(newOrder);
  res.json(newOrder);
});

// GET ORDERS
app.get('/api/orders', verifyAuth, (req, res) => {
  res.json(orders);
});

// TEST API
app.get('/api/test', (req, res) => {
  res.json({ msg: 'Backend working' });
});

// STATIC FRONTEND
// 这里是改动的地方
app.use(express.static(path.join(__dirname, '../')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// START SERVER
const port = process.argv.length > 2 ? process.argv[2] : 4000;

async function initDB() {
  const db = await connectDB();
  console.log('Database connected!');
}

initDB();

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
