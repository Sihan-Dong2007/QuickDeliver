// database.js
const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${encodeURIComponent(config.password)}@${config.hostname}`;

let client;
let db;

async function connectDB() {
  if (db) return db; // 已连接就直接返回

  try {
    client = new MongoClient(url);
    await client.connect();

    // 选择数据库名字
    db = client.db('test'); // 你也可以改成你需要的名字，比如 'startup'
    await db.command({ ping: 1 });
    console.log('Database connected!');

    return db;
  } catch (err) {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  }
}

// 可以选择性导出 MongoClient，如果后续想直接操作 client
module.exports = { connectDB, client };
