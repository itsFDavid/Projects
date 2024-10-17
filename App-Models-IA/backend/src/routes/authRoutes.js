const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const  rateLimitMiddleware  = require('../middleware/rateLimitMiddleware');
const { modelEndpoint } = require('../controllers/modelEndpoint');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', verifyToken, logout);
router.post('/modelo-ia', rateLimitMiddleware, modelEndpoint);

module.exports = router;
