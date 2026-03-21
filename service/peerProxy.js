const { WebSocketServer, WebSocket } = require('ws');

// 在 app.listen 前面
function peerProxy(httpServer) {
  const socketServer = new WebSocketServer({ server: httpServer });

  socketServer.on('connection', (socket) => {
    socket.isAlive = true;

    // 转发消息给其他客户端
    socket.on('message', (data) => {
      socketServer.clients.forEach((client) => {
        if (client !== socket && client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    });

    // pong 心跳
    socket.on('pong', () => {
      socket.isAlive = true;
    });
  });

  // 心跳检测
  setInterval(() => {
    socketServer.clients.forEach((client) => {
      if (client.isAlive === false) return client.terminate();
      client.isAlive = false;
      client.ping();
    });
  }, 10000);

  return socketServer;
}

// 启动 server
const port = process.argv.length > 2 ? process.argv[2] : 4000;
const server = app.listen(port, () => console.log(`Listening on port ${port}`));

// 启动 WebSocket
const wsServer = peerProxy(server);

// 在订单创建后广播消息
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

  // 广播给所有 WebSocket 客户端
  const message = JSON.stringify({ type: 'new_order', data: newOrder });
  wsServer.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(message);
  });

  res.json(newOrder);
});