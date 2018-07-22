const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workoutSchema = new Schema({
  description: String,
  duration: String,
  date: {type: Date, default: Date.now},
  versionKey: false,
  _id: false
});

module.exports = mongoose.model('Workout', workoutSchema)
