const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();
const DB = require('./database.js');

const authCookieName = 'token';

// The service port may be set on the command line
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the application's static content
app.use(express.static('public'));

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth token for a new user (Signup)
apiRouter.post('/auth/signup', async (req, res) => {
  if (await findUser('store', req.body.store)) {
    res.status(409).send({ msg: 'Existing store' });
  } else {
    const user = await createUser(req.body.store, req.body.password);

    setAuthCookie(res, user.token);
    res.send({ store: user.store });
  }
});

// Login
apiRouter.post('/auth/login', async (req, res) => {
  const user = await findUser('store', req.body.store);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      await DB.updateUserToken(user.store, user.token);
      setAuthCookie(res, user.token);
      res.send({ store: user.store });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// Logout
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    await DB.updateUserToken(user.store, null);
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Middleware to verify that the user is authorized
const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

// ================= Orders API =================

// Create order
apiRouter.post('/orders', verifyAuth, async (req, res) => {
  const order = {
    id: uuid.v4(),
    store: req.user.store,
    food: req.body.food,
    weather: req.body.weather,
    transportTime: req.body.transportTime,
  };

  await DB.addOrder(order);
  res.send(order);
});

// Get orders
apiRouter.get('/orders', verifyAuth, async (req, res) => {
  const orders = await DB.getOrders();
  res.send(orders);
});

// Test API
apiRouter.get('/test', (req, res) => {
  res.send({ msg: 'Backend working' });
});

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// ================= Helper functions =================

async function createUser(store, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    store: store,
    password: passwordHash,
    token: uuid.v4(),
  };

  await DB.addUser(user);
  return user;
}

async function findUser(field, value) {
  if (!value) return null;

  if (field === 'token') {
    return DB.getUserByToken(value);
  }

  return DB.getUser(value);
}

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

// Start server
const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

