const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    // L'utilisateur qui reçoit la notification
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Le titre de la notification (ex: "Nouvelle tâche")
    title: {
      type: String,
      required: true,
      trim: true,
    },
    // Le message détaillé
    message: {
      type: String,
      required: true,
    },
    // Le type de notification (optionnel, utile pour le design côté front)
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'alert'],
      default: 'info',
    },
    // Statut de lecture
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Ajoute automatiquement createdAt et updatedAt
  }
);

module.exports = mongoose.model('Notification', notificationSchema);