const express = require('express');
const cors = require('cors');
const auth = require('./auth');
require('express-async-errors');

function unknownEndpoint(request, response) {
  response.status(404).send({ error: 'unknown endpoint' });
}

function errorHandler(err, request, response, next) {
  console.error(`${err.name}: ${err.message}`);

  if (err.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  if (err.name === 'ValidationError') {
    return response.status(400).json({ error: err.message });
  }
  if (err.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' });
  }

  next(err);
}

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/login', auth.login);
app.use('/api/users', require('./users'));
app.use(auth.authorize);
app.use('/api/blogs', require('./blogs'));
app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
