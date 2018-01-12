'use strict';

let express = require('express');
let morgan = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
const winston = require('winston');

let npm = require('./routes/npm');
let pip = require('./routes/pip');
let sudo = require('./routes/sudo');
let wget = require('./routes/wget');
let linkchecker = require('./routes/linkchecker');

let app = express();

winston.loggers.add('mateo',{
    transports: [
        new winston.transports.Console({
            level: 'debug',
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
    let err = new Error('Not Found');
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
