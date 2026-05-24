const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  actionType: {
    type: String,
    required: true,
    enum: ['Création', 'Modification', 'Suppression'] // Restreint aux types demandés
  },
  description: {
    type: String,
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project', // Lien vers votre modèle Projet
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Lien vers votre modèle Utilisateur (auteur)
    required: true
  }
}, {
  timestamps: true // Gère automatiquement le horodatage (createdAt, updatedAt)
});

module.exports = mongoose.model('Activity', activitySchema);