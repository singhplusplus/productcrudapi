require('./src/utils/authconfig.js')
const appconstants = require('./appconstants.js')

// Imports
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('morgan');
const passport = require('passport');

const app = express();

app.use(logger(appconstants.config.APP_ENV));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(passport.initialize());

const index = require('./src/routes/index.js');
app.use('/', index);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;
