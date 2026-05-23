const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // <-- On importe le vigile

// Routes publiques
router.post('/register', register);
router.post('/login', login);

// Route privée (protégée par le middleware)
router.get('/me', protect, getMe); // <-- Seul un utilisateur connecté peut y accéder

module.exports = router;