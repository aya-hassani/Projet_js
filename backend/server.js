const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  actionType: {
    type: String,
    required: true,
    enum: ['Création', 'Modification', 'Suppression'] // Sécurité pour n'accepter que ces 3 types
  },
  description: {
    type: String,
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project', // Référence au modèle de projet de votre groupe
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Fait le lien avec ton module d'authentification des utilisateurs
    required: true
  }
}, {
  timestamps: true // Génère automatiquement les champs 'createdAt' (utile pour l'ordre chronologique inverse) et 'updatedAt'
});

module.exports = mongoose.model('Activity', activitySchema);