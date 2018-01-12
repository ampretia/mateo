'use strict';

let express = require('express');
let router = express.Router();
const stub = require('../cmdstubs/linkchecker');


/* POST users listing. */
router.post('/', function(req, res, next) {
    req.logger.debug('http post - linkchecker');
    let returndata = stub._run(req.data);
    // need to get the npm stub and call with the
    let json = (JSON.stringify(returndata));
    res.send(json);
    req.logger.debug('Response data is ',json);
});



module.exports = router;
