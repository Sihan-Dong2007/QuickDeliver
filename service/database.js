const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);

let db;
let usersCollection;
let ordersCollection;

// ================== 连接数据库 ==================
async function connectDB() {
  if (!db) {
    try {
      await client.connect();
      db = client.db('quickdeliver'); // 数据库名
      usersCollection = db.collection('users');
      ordersCollection = db.collection('orders');

      // 测试连接
      await db.command({ ping: 1 });
      console.log('Database connected!');
    } catch (err) {
      console.error(`Failed to connect to database: ${err.message}`);
      await client.close();
      process.exit(1);
    }
  }
  return db;
}

// ================== 用户操作 ==================

// 根据 store 获取用户
async function getUser(store) {
  await connectDB();
  return usersCollection.findOne({ store });
}

// 根据 token 获取用户
async function getUserByToken(token) {
  await connectDB();
  return usersCollection.findOne({ token });
}

// 添加用户
async function addUser(user) {
  await connectDB();
  return usersCollection.insertOne(user);
}

// 更新用户 token 或其他字段
async function updateUserToken(store, token) {
  await connectDB();
  return usersCollection.updateOne({ store }, { $set: { token } });
}

// ================== 订单操作 ==================

// 添加订单
async function addOrder(order) {
  await connectDB();
  return ordersCollection.insertOne(order);
}

// 获取订单，可传 filter
async function getOrders(filter = {}) {
  await connectDB();
  return ordersCollection.find(filter).toArray();
}

// ================== 导出模块 ==================
module.exports = {
  connectDB,
  getUser,
  getUserByToken,
  addUser,
  updateUserToken,
  addOrder,
  getOrders,
};