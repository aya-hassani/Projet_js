import React, { useState, useEffect } from 'react';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [message, setMessage] = useState('');

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/projects', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setProjects(data.data || data);
            }
        } catch (error) {
            console.error("Erreur");
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/projects', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ title, description, status: 'actif' })
            });
            if (response.ok) {
                setTitle('');
                setDescription('');
                fetchProjects();
            }
        } catch (error) {
            setMessage("Erreur lors de la création du projet.");
        }
    };

    const handleInviteMember = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/projects/${selectedProjectId}/invite`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ email: inviteEmail })
            });
            const data = await response.json();
            setMessage(data.message || "Invitation traitée.");
            if (response.ok) {
                setInviteEmail('');
            }
        } catch (error) {
            setMessage("Erreur d'invitation.");
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h2>Gestion des Projets</h2>
            
            <form onSubmit={handleCreateProject} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd' }}>
                <h3>Créer un Nouveau Projet</h3>
                <input type="text" placeholder="Titre du projet" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ marginRight: '10px', padding: '5px' }} />
                <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required style={{ marginRight: '10px', padding: '5px' }} />
                <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', padding: '6px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Créer</button>
            </form>

            {message && <p style={{ color: 'blue' }}>{message}</p>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                {projects.map((proj) => (
                    <div key={proj._id} style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
                        <h4>{proj.title} ({proj.status})</h4>
                        <p>{proj.description}</p>
                        
                        <button onClick={() => setSelectedProjectId(proj._id)} style={{ backgroundColor: '#28a745', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Inviter un membre
                        </button>

                        {selectedProjectId === proj._id && (
                            <form onSubmit={handleInviteMember} style={{ marginTop: '10px' }}>
                                <input type="email" placeholder="Email du membre" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} required style={{ padding: '5px' }} />
                                <button type="submit" style={{ marginLeft: '5px', padding: '5px' }}>Envoyer</button>
                            </form>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectList;