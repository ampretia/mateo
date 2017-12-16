var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const winston = require('winston');

var npm = require('./routes/npm');
var pip = require('./routes/pip');
var sudo = require('./routes/sudo');
var wget = require('./routes/wget');
var linkchecker = require('./routes/linkchecker');

var app = express();

winston.loggers.add('mateo',{
  transports: [
      new winston.transports.Console({
          level: "debug",
          colorize: true
          // timestamp: function () {
          //     return (new Date()).toISOString();
          // }
      })
  ]
});

app.use(morgan('dev'));
app.use(function(req, res, next) {
  req.logger = winston.loggers.get('mateo'); 
  
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/npm', npm);
app.use('/pip', pip);
app.use('/linkchecker', linkchecker);
app.use('/sudo', sudo);
app.use('/wget', wget);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
