const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);

let db;
let usersCollection;
let ordersCollection;

// 连接数据库（lazy 初始化）
async function connectDB() {
  if (!db) {
    try {
      await client.connect();
      db = client.db('quickdeliver'); // 你的数据库名
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

// —— 用户操作 ——
// 确保操作前数据库已连接
async function addUser(user) {
  await connectDB();
  return usersCollection.insertOne(user);
}

async function getUser(query) {
  await connectDB();
  return usersCollection.findOne(query);
}

async function updateUser(query, updateObj) {
  await connectDB();
  return usersCollection.updateOne(query, { $set: updateObj });
}

async function removeUserToken(query) {
  await connectDB();
  return usersCollection.updateOne(query, { $unset: { token: 1 } });
}

// —— 订单操作 —— 
async function addOrder(order) {
  await connectDB();
  return ordersCollection.insertOne(order);
}

async function getOrders(filter = {}) {
  await connectDB();
  return ordersCollection.find(filter).toArray();
}

// —— 导出模块 —— 
module.exports = {
  connectDB,
  addUser,
  getUser,
  updateUser,
  removeUserToken,
  addOrder,
  getOrders,
};