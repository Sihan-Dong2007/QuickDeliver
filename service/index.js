const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const cookieParser = require('cookie-parser');
const { connectDB, client } = require('./database.js'); // 引入数据库
const { peerProxy } = require('./peerProxy'); // 引入 WebSocket

const app = express();

app.use(express.json());
app.use(cookieParser());

// 启动时连接数据库
let db;
let usersCollection;
let ordersCollection;

(async function initDB() {
  db = await connectDB();
  usersCollection = db.collection('users');   // 用户集合
  ordersCollection = db.collection('orders'); // 订单集合
})();

// SIGNUP
app.post('/api/signup', async (req, res) => {
  const { store, password } = req.body;

  if (!store || !password) {
    return res.status(400).json({ msg: 'Missing store or password' });
  }

  const existing = await usersCollection.findOne({ store });
  if (existing) {
    return res.status(409).json({ msg: 'Store already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: uuidv4(),
    store,
    password: hashedPassword,
    token: uuidv4(),
  };

  await usersCollection.insertOne(newUser);

  res.cookie('token', newUser.token, {
    httpOnly: true,
    sameSite: 'strict',
  });

  res.json({ store: newUser.store });
});

// LOGIN
app.post('/api/login', async (req, res) => {
  const { store, password } = req.body;

  const user = await usersCollection.findOne({ store });
  if (!user) {
    return res.status(401).json({ msg: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ msg: 'Invalid credentials' });
  }

  const token = uuidv4();
  await usersCollection.updateOne({ store }, { $set: { token } });

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'strict',
  });

  res.json({ store: user.store });
});

// LOGOUT
app.delete('/api/logout', async (req, res) => {
  const token = req.cookies.token;

  if (token) {
    await usersCollection.updateOne({ token }, { $set: { token: null } });
  }

  res.clearCookie('token');
  res.status(204).end();
});

// AUTH MIDDLEWARE
async function verifyAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ msg: 'Unauthorized' });

  const user = await usersCollection.findOne({ token });
  if (!user) return res.status(401).json({ msg: 'Unauthorized' });

  next();
}

// CREATE ORDER
app.post('/api/orders', verifyAuth, async (req, res) => {
  const { food, weather, transportTime } = req.body;

  if (!food || !weather || !transportTime) {
    return res.status(400).json({ msg: 'Missing order data' });
  }

  const newOrder = {
    id: uuidv4(),
    food,
    weather,
    transportTime,
  };

  await ordersCollection.insertOne(newOrder);

  // === 广播 WebSocket 消息 ===
  if (wsServer) {
    const message = JSON.stringify({ type: 'new_order', data: newOrder });
    wsServer.clients.forEach((client) => {
      if (client.readyState === require('ws').WebSocket.OPEN) client.send(message);
    });
  }

  res.json(newOrder);
});

// GET ORDERS
app.get('/api/orders', verifyAuth, async (req, res) => {
  const orders = await ordersCollection.find().toArray();
  res.json(orders);
});

// TEST API
app.get('/api/test', (req, res) => {
  res.json({ msg: 'Backend working' });
});

// STATIC FRONTEND
app.use(express.static('public'));

app.use((req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// START SERVER
const port = process.argv.length > 2 ? process.argv[2] : 4000;
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// === 启动 WebSocket 服务 ===
const wsServer = peerProxy(server);