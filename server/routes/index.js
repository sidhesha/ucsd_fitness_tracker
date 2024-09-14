const express = require('express');
const router = express.Router();

/* /* endpoint controllers */
router.use('/api', require('./api'));

module.exports = router;
