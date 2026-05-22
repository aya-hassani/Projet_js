import React, { useState, useEffect } from 'react';

const TaskForm = ({ projectId, onTaskCreated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('moyenne');

    useEffect(() => {
        const savedTitle = localStorage.getItem('draft_task_title');
        const savedDesc = localStorage.getItem('draft_task_desc');
        if (savedTitle) setTitle(savedTitle);
        if (savedDesc) setDescription(savedDesc);
    }, []);

    useEffect(() => {
        localStorage.setItem('draft_task_title', title);
        localStorage.setItem('draft_task_desc', description);
    }, [title, description]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/projects/${projectId}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, description, priority, status: 'à faire' })
            });

            if (response.ok) {
                setTitle('');
                setDescription('');
                localStorage.removeItem('draft_task_title');
                localStorage.removeItem('draft_task_desc');
                if (onTaskCreated) onTaskCreated();
            }
        } catch (error) {
            console.error("Erreur");
        }
    };

    return (
        <div style={{ padding: '15px', border: '1px solid #ccc', margin: '15px 0' }}>
            <h4>Nouvelle Tâche</h4>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Titre" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                    style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '5px' }} 
                />
                <textarea 
                    placeholder="Description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    required 
                    style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '5px' }} 
                />
                <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ display: 'block', marginBottom: '10px', padding: '5px' }}>
                    <option value="basse">Basse</option>
                    <option value="moyenne">Moyenne</option>
                    <option value="haute">Haute</option>
                </select>
                <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer' }}>Créer la tâche</button>
            </form>
        </div>
    );
};

export default TaskForm;