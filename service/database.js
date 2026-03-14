const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;

const client = new MongoClient(url);
const db = client.db('test');

async function main() {
  try {
    await db.command({ ping: 1 });
    console.log("Database connected!");
  } catch (err) {
    console.log("Connection failed:", err);
  } finally {
    await client.close();
  }
}

main();
