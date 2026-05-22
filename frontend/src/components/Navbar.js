import React, { useState, useEffect } from 'react';

const Navbar = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/notifications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                const fetchedNotifications = data.data || data;
                setNotifications(fetchedNotifications);
                setUnreadCount(fetchedNotifications.filter(n => !n.isRead).length);
            }
        } catch (error) {
            console.error("Erreur");
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(() => {
            fetchNotifications();
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const updated = notifications.map(n => n._id === id ? { ...n, isRead: true } : n);
                setNotifications(updated);
                setUnreadCount(prev => Math.max(0, prev - 1));
                localStorage.setItem('archived_notifications', JSON.stringify(updated));
            }
        } catch (error) {
            console.error("Erreur");
        }
    };

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 30px', background: '#333', color: 'white', fontFamily: 'Arial' }}>
            <div style={{ fontWeight: 'bold', fontSize: '18px' }}>TaskFlow</div>
            <div style={{ position: 'relative' }}>
                <button onClick={() => setShowDropdown(!showDropdown)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '16px' }}>
                    🔔 Notifications {unreadCount > 0 && <span style={{ background: 'red', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '12px', marginLeft: '5px' }}>{unreadCount}</span>}
                </button>

                {showDropdown && (
                    <div style={{ position: 'absolute', right: 0, top: '30px', background: 'white', color: 'black', border: '1px solid #ccc', width: '260px', borderRadius: '4px', zIndex: 1000, boxShadow: '0px 4px 8px rgba(0,0,0,0.1)' }}>
                        <h5 style={{ margin: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Dernières alertes</h5>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: '200px', overflowY: 'auto' }}>
                            {notifications.length === 0 ? <li style={{ padding: '10px', fontSize: '13px', color: '#888' }}>Aucune notification</li> : 
                            notifications.map(n => (
                                <li key={n._id} onClick={() => !n.isRead && markAsRead(n._id)} style={{ padding: '10px', fontSize: '13px', borderBottom: '1px solid #f9f9f9', background: n.isRead ? '#fff' : '#f0f7ff', cursor: n.isRead ? 'default' : 'pointer' }}>
                                    {n.message}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;