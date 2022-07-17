require('./src/utils/authconfig.js')

// Imports
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// const logger = require('morgan');
const passport = require('passport');

const app = express();

// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(passport.initialize());

const home = require('./src/routes/home.js');
app.use('/', home);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err)
});

module.exports = app;
