const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true, minLength: 3},
  passwordHash: {type: String, required: true},
  name: {type: String, required: false},
});
userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash; // removed to not leak secrets
  }
});

module.exports = User;
