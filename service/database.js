const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);

let db;
let usersCollection;
let ordersCollection;

// 连接数据库
async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db('quickdeliver'); // 这里可以换成你自己的数据库名
    usersCollection = db.collection('users');
    ordersCollection = db.collection('orders');
    console.log('Database connected!');
  }
  return db;
}

// 用户操作
async function addUser(user) {
  await usersCollection.insertOne(user);
}

async function getUser(store) {
  return await usersCollection.findOne({ store });
}

async function updateUserToken(store, token) {
  await usersCollection.updateOne(
    { store },
    { $set: { token } }
  );
}

// 订单操作
async function addOrder(order) {
  await ordersCollection.insertOne(order);
}

async function getOrders() {
  return await ordersCollection.find().toArray();
}

module.exports = {
  connectDB,
  addUser,
  getUser,
  updateUserToken,
  addOrder,
  getOrders,
};
