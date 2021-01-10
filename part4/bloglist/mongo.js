const mongoose = require('mongoose');

function connect(mongodb_uri) {
  mongoose.connect(
    mongodb_uri,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }
  ).then(() => {
    console.log('connected to MongoDB');
  }).catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });  
}

function disconnect() {
  mongoose.connection.close();
}

module.exports = {
  connect,
  disconnect
};
