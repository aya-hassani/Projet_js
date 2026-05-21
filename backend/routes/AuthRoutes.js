const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');

// Route pour l'inscription : POST http://localhost:5000/api/auth/register
router.post('/register', register);

// Route pour la connexion : POST http://localhost:5000/api/auth/login
router.post('/login', login);

// Note : La route /me (profil) sera ajoutée dès qu'on aura écrit le middleware de sécurité !

module.exports = router;