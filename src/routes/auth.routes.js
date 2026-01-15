const express = require('express');
const { login, register, demoLogin } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/demo', demoLogin);

module.exports = router;