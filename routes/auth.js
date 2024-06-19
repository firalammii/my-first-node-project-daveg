const express = require('express');
const {handleLogin, handleLogout} = require('../controllers/auth');

const router = express.Router();

router.post('/login', handleLogin);
router.get('/logout', handleLogout);

module.exports = router;