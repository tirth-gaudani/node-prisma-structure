var express = require('express');
var router = express.Router();

router.use('/auth', require('./Auth/auth.route'));

module.exports = router;