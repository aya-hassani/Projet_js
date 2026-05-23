import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    const [stats, setStats] = useState({ totalProjects: 0, totalTasks: 0, pending: 0, inProgress: 0, completed: 0 });

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/dashboard/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setStats(data);
            }
        } catch (error) {
            console.error("Erreur");
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h2>Tableau de Bord</h2>
            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                <div style={{ padding: '20px', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '5px', textAlign: 'center', flex: 1 }}>
                    <h3>{stats.totalProjects}</h3>
                    <p>Projets Actifs</p>
                </div>
                <div style={{ padding: '20px', background: '#d1ecf1', border: '1px solid #bee5eb', borderRadius: '5px', textAlign: 'center', flex: 1 }}>
                    <h3>{stats.totalTasks}</h3>
                    <p>Total Tâches</p>
                </div>
                <div style={{ padding: '20px', background: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '5px', textAlign: 'center', flex: 1 }}>
                    <h3>{stats.inProgress}</h3>
                    <p>En Cours</p>
                </div>
                <div style={{ padding: '20px', background: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '5px', textAlign: 'center', flex: 1 }}>
                    <h3>{stats.completed}</h3>
                    <p>Terminées</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;