var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const config = require('./config');

var indexRouter = require('./routes/index');

require('dotenv').config();

var app = express();

// socket.io
app.io = indexRouter.io;

// Settings for webhook
app.use('/stripe_webhook', bodyParser.raw({
  type: "*/*"
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json({
  limit: `${config.maxPayloadSize}mb`
}));
app.use(express.urlencoded({
  extended: true,
  limit: `${config.maxPayloadSize}mb`
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development, only status and message in production
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {status: err.status, message: err.message};

  // Log error in development
  if (req.app.get('env') === 'development') console.log(err);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
