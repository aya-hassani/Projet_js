// Variable globale pour stocker les alertes en mémoire client (Exigence sujet)
let clientNotificationsMemo = [];

// 🕒 EXIGENCE DU SUJET : Récupérer les données via un mécanisme de polling (setInterval)
async function fetchNotifications() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch('http://localhost:5000/api/notifications', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            clientNotificationsMemo = await response.json();
            updateNotificationsDOM();
        }
    } catch (error) {
        console.error('Erreur lors du polling des notifications:', error);
    }
}

// Mettre à jour l'arbre DOM (Badge visuel + liste déroulante)
function updateNotificationsDOM() {
    const notifBadge = document.getElementById('notifBadge');
    const unreadList = document.getElementById('unreadList');

    if (!notifBadge || !unreadList) return;

    // 1. Mise à jour du compteur sur le badge rouge
    if (clientNotificationsMemo.length > 0) {
        notifBadge.innerText = clientNotificationsMemo.length;
        notifBadge.style.display = 'block';
    } else {
        notifBadge.style.display = 'none';
    }

    // 2. Génération de la liste des messages non lus
    unreadList.innerHTML = '';
    if (clientNotificationsMemo.length === 0) {
        unreadList.innerHTML = '<p class="notif-empty">Aucune nouvelle notification.</p>';
    } else {
        clientNotificationsMemo.forEach(notif => {
            const item = document.createElement('div');
            item.className = 'notif-list-item';
            
            // Éviter les bugs de guillemets dans les chaînes JS
            const cleanMessage = notif.message.replace(/'/g, "\\'");

            item.innerHTML = `
                <div class="notif-text-cell">${notif.message}</div>
                <div class="notif-action-cell">
                    <button class="mark-read-btn" onclick="markAsRead('${notif._id}', '${cleanMessage}')">✓</button>
                </div>
            `;
            unreadList.appendChild(item);
        });
    }
}

// 💾 EXIGENCE DU SUJET : Marquer comme lue (PATCH) et archiver dans le LocalStorage
async function markAsRead(id, message) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            // Sauvegarder immédiatement dans l'historique permanent du navigateur
            let localArchives = JSON.parse(localStorage.getItem('archived_notifications')) || [];
            
            // On vérifie pour éviter les doublons dans les archives
            if (!localArchives.some(n => n._id === id)) {
                localArchives.push({ _id: id, message: message, read: true });
                localStorage.setItem('archived_notifications', JSON.stringify(localArchives));
            }

            // Filtrer la mémoire client pour mettre à jour le badge instantanément
            clientNotificationsMemo = clientNotificationsMemo.filter(n => n._id !== id);
            
            // Rafraîchir les affichages visuels
            updateNotificationsDOM();
            loadArchivesDOM();
        }
    } catch (error) {
        console.error('Erreur lors du traitement de la notification:', error);
    }
}

// Charger l'historique archivé persistant depuis le LocalStorage
function loadArchivesDOM() {
    const archiveList = document.getElementById('archiveList');
    if (!archiveList) return;

    const localArchives = JSON.parse(localStorage.getItem('archived_notifications')) || [];
    archiveList.innerHTML = '';

    if (localArchives.length === 0) {
        archiveList.innerHTML = '<p class="notif-empty">Aucun historique archivé.</p>';
    } else {
        localArchives.forEach(notif => {
            const p = document.createElement('p');
            p.className = 'archive-item-text';
            p.innerText = notif.name || notif.message; // Gère les structures d'objets ou de chaînes simples
            archiveList.appendChild(p);
        });
    }
}

// Événements d'initialisation au chargement de l'index
document.addEventListener('DOMContentLoaded', () => {
    const bellBtn = document.getElementById('bellBtn');
    const notifDropdown = document.getElementById('notifDropdown');
    const logoutBtn = document.getElementById('logoutBtn');

    // Lancement des premiers chargements de données
    fetchNotifications();
    loadArchivesDOM();

    // 🕒 Démarrage officiel du polling toutes les 30 secondes
    setInterval(fetchNotifications, 30000);

    // Ouvrir / Fermer le dropdown de la cloche
    if (bellBtn && notifDropdown) {
        bellBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notifDropdown.classList.toggle('active');
        });

        // Fermer la cloche si on clique à côté
        document.addEventListener('click', () => {
            notifDropdown.classList.remove('active');
        });
    }

    // Gestion propre de la Déconnexion
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        });
    }
});