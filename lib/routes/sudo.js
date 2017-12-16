var express = require('express');
var router = express.Router();
const stub = require('../cmdstubs/sudo');


/* POST users listing. */
router.post('/', function(req, res, next) {
  req.logger.debug('http post - sudo')
  let returndata = stub._run(req.data);
  // need to get the npm stub and call with the 
  let json = (JSON.stringify(returndata));
  res.send(json);
  req.logger.debug('Response data is ',json)
});



module.exports = router;
