const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  logs: Array
}, {timestamp: true});

module.exports = mongoose.model('User', userSchema);
