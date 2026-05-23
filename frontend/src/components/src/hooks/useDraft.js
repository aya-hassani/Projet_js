import { useState, useEffect } from 'react';

/**
 * Custom Hook pour gérer les brouillons et la sauvegarde locale automatique
 * @param {string} key - La clé unique pour stocker le brouillon dans le localStorage (ex: 'task_draft')
 * @param {Object} initialValue - Les champs initiaux du formulaire
 */
const useDraft = (key, initialValue) => {
  // 1. Initialiser l'état avec le brouillon existant ou la valeur initiale
  const [draft, setDraft] = useState(() => {
    try {
      const savedDraft = localStorage.getItem(key);
      // Si un brouillon existe, on le convertit en objet JS, sinon valeur initiale
      return savedDraft ? JSON.parse(savedDraft) : initialValue;
    } catch (error) {
      console.error("Erreur de lecture du localStorage:", error);
      return initialValue;
    }
  });

  // 2. Sauvegarder automatiquement dans le localStorage à chaque modification du brouillon
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(draft));
    } catch (error) {
      console.error("Erreur d'écriture dans le localStorage:", error);
    }
  }, [key, draft]);

  // 3. Fonction pour mettre à jour un champ spécifique du brouillon
  const handleChange = (fieldName, value) => {
    setDraft((prevDraft) => ({
      ...prevDraft,
      [fieldName]: value,
    }));
  };

  // 4. Fonction pour vider le brouillon (à appeler quand le formulaire est soumis avec succès)
  const clearDraft = () => {
    localStorage.removeItem(key);
    setDraft(initialValue);
  };

  return {
    draft,
    handleChange,
    clearDraft,
    setDraft
  };
};

export default useDraft;