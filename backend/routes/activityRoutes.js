const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
// const { protect } = require('../middleware/authMiddleware'); // Décommente si vous utilisez un middleware d'auth

// Route dédiée : GET /api/projects/:id/activities
// Note : Si cette route est montée sur '/api', le chemin complet correspondra à ton énoncé.
router.get('/projects/:id/activities', async (regexReq, res) => {
  try {
    const projectId = regexReq.params.id;

    // Récupère les activités liées au projet
    const activities = await Activity.find({ project: projectId })
      .populate('user', 'name email') // Récupère le nom et l'email de l'auteur (évite de renvoyer le mot de passe !)
      .sort({ createdAt: -1 }); // Tri par date décroissante (chronologique inverse)

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de l'historique", error: error.message });
  }
});

module.exports = router;