const express = require('express');
const router = express.Router();

/* /api/* endpoint controllers */
router.use('/busy', require('./busy'))
router.use('/login', require('./login'));
router.use('/logout', require('./logout'));
router.use('/user', require('./user'));
router.use('/workout', require('./workout'));
router.use('/chat', require('./chat'));

module.exports = router;
