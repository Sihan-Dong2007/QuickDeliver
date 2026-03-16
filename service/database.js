const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);

// 直接创建数据库和集合
const db = client.db('quickdeliver'); // 你的数据库名
const usersCollection = db.collection('users');
const ordersCollection = db.collection('orders');

// 测试数据库连接
(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log('Connected to database!');
  } catch (ex) {
    console.error(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
})();

//  用户操作 

// 根据 store 获取用户
function getUser(store) {
  return usersCollection.findOne({ store });
}

// 根据 token 获取用户
function getUserByToken(token) {
  return usersCollection.findOne({ token });
}

// 添加用户
async function addUser(user) {
  await usersCollection.insertOne(user);
}

// 更新用户（可更新任意字段）
async function updateUser(user) {
  return usersCollection.updateOne({ store: user.store }, { $set: user });
}

// 移除用户 token
async function updateUserRemoveAuth(user) {
  return usersCollection.updateOne({ store: user.store }, { $unset: { token: 1 } });
}

//  订单操作 

// 添加订单
async function addOrder(order) {
  return ordersCollection.insertOne(order);
}

// 获取订单，可传 filter
function getOrders(filter = {}) {
  return ordersCollection.find(filter).toArray();
}

//  导出模块 
module.exports = {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  updateUserRemoveAuth,
  addOrder,
  getOrders,
};