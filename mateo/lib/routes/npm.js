'use strict';

let express = require('express');
let router = express.Router();
const npmstub = require('../cmdstubs/npm');


/* POST users listing. */
router.post('/', function(req, res, next) {
    // need to get the npm stub and call with the
    res.send('respond with a resource');
});

/* POST users listing. */
router.post('/run', function(req, res, next) {
    req.logger.debug('http post - npm/run');
    let data = npmstub.run();
    // need to get the npm stub and call with the
    let json = (JSON.stringify(data));
    res.send(json);
    req.logger.debug('Response data is ',json);
});

router.post('/install', function(req, res, next) {
    req.logger.debug('http post - npm/install');
    let data = npmstub.install.apply(null,req.body.data);
    // need to get the npm stub and call with the
    let json = (JSON.stringify(data));
    res.send(json);
    req.logger.debug('Response data is ',json);
});


module.exports = router;
