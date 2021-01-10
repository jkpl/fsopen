const bcrypt = require('bcrypt');
const router = require('express').Router();
const User = require('./models/user');
const ValidationError = require('./validationerror');

const saltRounds = 10;

function hashPassword(password) {
  return bcrypt.hash(password, saltRounds)
}

router.post('/', async (request, response) => {
  if (request.body.password.length < 3) {
    throw new ValidationError('Password is too short. At least 3 characters are required.')
  }

  const passwordHash = await hashPassword(request.body.password);
  const user = new User({
    username: request.body.username,
    name: request.body.name,
    passwordHash,
  });
  
  const savedUser = await user.save();
  response.json(savedUser);
});

module.exports = router;
