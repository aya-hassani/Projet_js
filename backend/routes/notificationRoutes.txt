const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware'); // Ton middleware de sécurité

// Sécurité : Toutes les routes ci-dessous nécessitent d'être connecté
router.use(protect);

// @route   GET /api/notifications
// @desc    Récupérer toutes les notifications de l'utilisateur connecté
router.get('/', getNotifications);

// @route   PUT /api/notifications/:id
// @desc    Marquer une notification spécifique comme lue (en passant son ID dans l'URL)
router.put('/:id', markAsRead);

module.exports = router;