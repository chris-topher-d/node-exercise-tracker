const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors'); // FOR FCC TESTING
const mongoose = require('mongoose');
const User = require('./models/newUser');
const Workout = require('./models/newWorkout');
const db = require('./config/db');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// CONNECT to DB
mongoose.connect(db.url);

// CREATE new user
app.get('/api/exercise/new-user', (req, res) => {
  let username = req.query.username;

  User.findOne({'username': username}, (err, user) => {
    if (err) {
      return handleError(err);
    } else if (user) {
      return res.send('User already exists');
    } else {
      let user = new User({'username': username, 'log': []});
      user.save((err, user) => {
        if (err) return res.send('Error saving to the database');
        return res.json({'username': user.username, _id: user._id});
      });
    }
  });
});

// CREATE new exercise entry
app.get('/api/exercise/add', (req, res) => {
  let id = req.query.userId;
  let log = {
    description: req.query.desc,
    duration: req.query.duration,
    date: req.query.date || this.default
  };

  User.findOne({'_id': id}, (err, user) => {
    if (err) {
      return handleError(err);
    } else if (user) {
      let workout = new Workout(log);
      user.logs.push(workout);
      user.save((err, entry) => {
        if (err) return res.json(err);
        return res.json({
          _id: entry._id,
          username: entry.username,
          workout: entry.logs.slice(-1)[0]
        });
      });
    }
  });
});

// GET user exercise logs
app.get('/api/exercise/log', (req, res) => {
  let id = req.query.userId;
  let from = req.query.from === undefined ? new Date(0000-00-00) : new Date(req.query.from);
  let to = req.query.to === undefined ? new Date() : new Date(req.query.to);
  let limit = !req.query.limit ? null : req.query.limit;

  User.find({'_id': id})
    .exec((err, user) => {
      if (err) return res.json(err);
      if (!user) return res.send(`No logs found for user id ${id}`);
      let logs = user[0].logs.filter(log => {
        return log.date >= from && log.date <= to;
      }).slice(0, limit || user[0].logs.length);
      logs.length > 0 ? res.send(logs) : res.send('No logs found');
    });
});

let port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
