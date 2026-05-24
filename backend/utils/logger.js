const Activity = require('../models/Activity');

/**
 * Enregistre automatiquement une activité dans la base de données
 * @param {string} actionType - 'Création', 'Modification' ou 'Suppression'
 * @param {string} description - Détail textuel de l'action
 * @param {string} projectId - ID du projet concerné
 * @param {string} userId - ID de l'utilisateur qui a fait l'action
 */
const logActivity = async (actionType, description, projectId, userId) => {
  try {
    const newActivity = new Activity({
      actionType,
      description,
      project: projectId,
      user: userId
    });
    
    await newActivity.save();
    console.log(`[Logger] Activité enregistrée : ${actionType} sur le projet ${projectId}`);
  } catch (error) {
    console.error("[Logger Error] Impossible d'enregistrer l'activité :", error.message);
  }
};

module.exports = { logActivity };