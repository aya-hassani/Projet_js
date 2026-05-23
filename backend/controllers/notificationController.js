const Notification = require('../models/Notification');

// @desc    Récupérer toutes les notifications de l'utilisateur connecté
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    // req.user.id est injecté automatiquement par ton middleware 'protect'
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 }); // Tri de la plus récente à la plus ancienne

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur serveur lors de la récupération des notifications', 
      error: error.message 
    });
  }
};

// @desc    Marquer une notification comme lue
// @route   PUT /api/notifications/:id
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification introuvable' });
    }

    // Sécurité importante : On vérifie que la notification appartient bien à l'utilisateur qui fait la demande
    if (notification.recipient.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Non autorisé à modifier cette notification' });
    }

    // Mise à jour du statut
    notification.isRead = true;
    await notification.save();

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur serveur lors de la modification de la notification', 
      error: error.message 
    });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
};