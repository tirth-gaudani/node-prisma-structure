var express = require('express');
var router = express.Router();

router.use('/auth', require('./Auth/node_prisma.auth.route'));

module.exports = router;