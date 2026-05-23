import React, { useState } from 'react';

const TaskForm = ({ onTaskCreated }) => {
  // États locaux pour stocker les valeurs des champs du formulaire
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation simple
    if (!title.trim()) {
      setError('Le titre de la tâche est obligatoire.');
      return;
    }

    try {
      // Récupération du token d'authentification stocké lors du login
      const token = localStorage.getItem('token');

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // On passe le vigile du backend
        },
        body: JSON.stringify({
          title,
          description,
          dueDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue lors de la création.');
      }

      // Succès
      setSuccess('Tâche créée avec succès !');
      setTitle('');
      setDescription('');
      setDueDate('');

      // Si le composant parent a besoin de rafraîchir la liste des tâches
      if (onTaskCreated) {
        onTaskCreated(data);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="task-form-container" style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Créer une nouvelle tâche</h3>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '5px' }}>Titre :</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Finir le rapport de stage"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '5px' }}>Description :</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ajoute des détails sur la tâche..."
            rows="4"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="dueDate" style={{ display: 'block', marginBottom: '5px' }}>Date limite :</label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Ajouter la tâche
        </button>
      </form>
    </div>
  );
};

export default TaskForm;