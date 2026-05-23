import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react'; // Installe si besoin : npm install lucide-react

const NotificationBell = ({ projectId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Charger les notifications (activités) liées au projet
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Ajuste l'URL avec http://localhost:5000 si ton serveur backend tourne séparément
        const response = await fetch(`/api/projects/${projectId}/activities`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Si vos routes sont protégées
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
          
          // Exemple : on considère ici les 3 dernières activités comme "nouvelles" pour le badge
          // (Tu pourras ajuster cette logique selon les besoins réels du groupe)
          setUnreadCount(data.length > 0 ? Math.min(data.length, 3) : 0);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des notifications:", error);
      }
    };

    if (projectId) {
      fetchNotifications();
      // Optionnel : rafraîchir toutes les 30 secondes pour simuler du temps réel
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [projectId]);

  const handleBellClick = () => {
    setIsOpen(!isOpen);
    setUnreadCount(0); // Réinitialise le badge dès que l'utilisateur ouvre le menu
  };

  return (
    <div style={styles.container}>
      {/* Icône de la Cloche */}
      <button onClick={handleBellClick} style={styles.bellButton}>
        <Bell size={24} color="#1c1e21" />
        {unreadCount > 0 && (
          <span style={styles.badge}>{unreadCount}</span>
        )}
      </button>

      {/* Menu Déroulant (Dropdown) */}
      {isOpen && (
        <div style={styles.dropdown}>
          <h3 style={styles.dropdownTitle}>Activités Récentes</h3>
          <div style={styles.notificationList}>
            {notifications.length === 0 ? (
              <p style={styles.emptyText}>Aucune activité récente pour le moment.</p>
            ) : (
              notifications.map((activity) => (
                <div key={activity._id} style={styles.notificationItem}>
                  <div style={styles.itemHeader}>
                    <span style={{ 
                      ...styles.actionBadge, 
                      ...styles[activity.actionType] 
                    }}>
                      {activity.actionType}
                    </span>
                    <span style={styles.date}>
                      {new Date(activity.createdAt).toLocaleDateString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p style={styles.description}>{activity.description}</p>
                  <span style={styles.user}>Par: {activity.user?.name || 'Utilisateur inconnu'}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Styles CSS-in-JS propres et alignés avec le design de TaskFlow
const styles = {
  container: {
    position: 'relative',
    display: 'inline-block',
  },
  bellButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    padding: '8px',
    borderRadius: '50%',
    transition: 'background-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    backgroundColor: '#e41e3f', // Rouge alerte
    color: 'white',
    borderRadius: '50%',
    padding: '2px 6px',
    fontSize: '11px',
    fontWeight: 'bold',
    minWidth: '14px',
    textAlign: 'center',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: '0',
    backgroundColor: 'white',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    borderRadius: '8px',
    width: '320px',
    maxHeight: '400px',
    overflowY: 'auto',
    zIndex: 1000,
    marginTop: '8px',
    border: '1px solid #dddfe2',
  },
  dropdownTitle: {
    margin: '0',
    padding: '12px 16px',
    fontSize: '15px',
    fontWeight: '600',
    borderBottom: '1px solid #dddfe2',
    color: '#1c1e21',
  },
  notificationList: {
    display: 'flex',
    flexDirection: 'column',
  },
  notificationItem: {
    padding: '12px 16px',
    borderBottom: '1px solid #f0f2f5',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionBadge: {
    fontSize: '11px',
    fontWeight: 'bold',
    padding: '2px 8px',
    borderRadius: '12px',
  },
  // Couleurs conditionnelles basées sur le type d'action
  Création: { backgroundColor: '#e6f4ea', color: '#137333' },
  Modification: { backgroundColor: '#fef7e0', color: '#b06000' },
  Suppression: { backgroundColor: '#fce8e6', color: '#c5221f' },
  
  date: {
    fontSize: '11px',
    color: '#65676b',
  },
  description: {
    margin: '4px 0 0 0',
    fontSize: '13px',
    color: '#1c1e21',
    lineHeight: '1.4',
  },
  user: {
    fontSize: '11px',
    color: '#65676b',
    fontStyle: 'italic',
    marginTop: '2px',
  },
  emptyText: {
    padding: '16px',
    textAlign: 'center',
    color: '#65676b',
    fontSize: '13px',
    margin: '0',
  }
};

export default NotificationBell;