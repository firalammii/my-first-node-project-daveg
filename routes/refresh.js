const express = require('express');
const handleRefreshToken = require('../controllers/refreshToken');
const router = express.Router();

router.get('/', handleRefreshToken);

module.exports = router;