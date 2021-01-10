require('dotenv').config();
const mongo = require('./mongo');
const app = require('./app');

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

mongo.connect(MONGODB_URI);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});
