'use strict';

let express = require('express');
let router = express.Router();
const stub = require('../cmdstubs/pip');


/* POST users listing. */
router.post('/', function(req, res, next) {
    // need to get the npm stub and call with the
    res.send('respond with a resource');
});

router.post('/install', function(req, res, next) {
    req.logger.debug('http post - pip/install');
    let data = stub.install();
    // need to get the npm stub and call with the
    let json = (JSON.stringify(data));
    res.send(json);
    req.logger.debug('Response data is ',json);
});


module.exports = router;
