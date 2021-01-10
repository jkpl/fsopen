const login = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/user');

const JWT_SECRET = process.env.JWT_SECRET;

login.post('/', async (request, response) => {
  const user = await User.findOne({ username: request.body.username });
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(request.body.password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, JWT_SECRET);

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
})

function getToken(request) {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
}

async function authorize(request, response, next) {
  const token = getToken(request);
  if (!token) {
    return response.status(401).json({error: 'token missing'});
  }
  const decodedToken = jwt.verify(token, JWT_SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({error: 'token invalid'});
  }
  const user = await User.findById(decodedToken.id);
  if (!user) {
    return response.status(401).json({error: 'token invalid'});
  }
  request.user = decodedToken;
  next();
}

module.exports = {
  login,
  authorize,
};
