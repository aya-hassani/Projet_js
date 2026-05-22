import React, { useState, useEffect } from 'react';

const TaskList = ({ projectId }) => {
    const [tasks, setTasks] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            let url = `http://localhost:5000/api/projects/${projectId}/tasks?page=${page}&limit=5`;
            if (statusFilter) url += `&status=${statusFilter}`;
            if (priorityFilter) url += `&priority=${priorityFilter}`;
            if (search) url += `&search=${search}`;

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setTasks(data.data || data.tasks);
                setTotalPages(data.totalPages || 1);
            }
        } catch (error) {
            console.error("Erreur");
        }
    };

    useEffect(() => {
        if (projectId) fetchTasks();
    }, [projectId, statusFilter, priorityFilter, search, page]);

    const handleStatusUpdate = async (taskId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/tasks/${taskId}/status`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) fetchTasks();
        } catch (error) {
            console.error("Erreur");
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h3>Gestion des Tâches</h3>
            
            <div style={{ marginBottom: '15px' }}>
                <input type="text" placeholder="Rechercher une tâche..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ padding: '5px', marginRight: '10px' }} />
                
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '5px', marginRight: '10px' }}>
                    <option value="">Tous les statuts</option>
                    <option value="à faire">À faire</option>
                    <option value="en cours">En cours</option>
                    <option value="terminé">Terminé</option>
                </select>

                <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} style={{ padding: '5px' }}>
                    <option value="">Toutes les priorités</option>
                    <option value="basse">Basse</option>
                    <option value="moyenne">Moyenne</option>
                    <option value="haute">Haute</option>
                </select>
            </div>

            <ul>
                {tasks.map((task) => (
                    <li key={task._id} style={{ padding: '10px', borderBottom: '1px solid #eee', listStyle: 'none' }}>
                        <strong>{task.title}</strong> - Priorité: {task.priority} - Statut: 
                        <select value={task.status} onChange={(e) => handleStatusUpdate(task._id, e.target.value)} style={{ marginLeft: '10px' }}>
                            <option value="à faire">À faire</option>
                            <option value="en cours">En cours</option>
                            <option value="terminé">Terminé</option>
                        </select>
                        <p style={{ fontSize: '12px', color: '#666', margin: '5px 0 0 0' }}>
                            Assigné à: {task.assignedTo ? `${task.assignedTo.name} (${task.assignedTo.email})` : 'Personne'}
                        </p>
                    </li>
                ))}
            </ul>

            <div style={{ marginTop: '15px' }}>
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>Précédent</button>
                <span style={{ margin: '0 10px' }}>Page {page} sur {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Suivant</button>
            </div>
        </div>
    );
};

export default TaskList;