const API_AUTH = "http://localhost:3000/api/auth";
const API_PROJECTS = "http://localhost:3000/api/projects";
const API_TASKS = "http://localhost:3000/api/tasks";

// 1. Gestion de la Connexion (Login)
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${API_AUTH}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                window.location.href = 'dashboard.html';
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
        }
    });
}

// 2. Gestion des Projets (Ajout)
const projectForm = document.getElementById('addProjectForm');
if (projectForm) {
    projectForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const projectData = {
            title: document.getElementById('projectTitle').value,
            description: document.getElementById('projectDesc').value,
            dueDate: document.getElementById('projectDueDate').value,
            status: document.getElementById('projectStatus').value
        };

        try {
            const response = await fetch(API_PROJECTS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(projectData)
            });
            if (response.ok) {
                alert("Projet ajouté avec succès !");
                location.reload();
            }
        } catch (error) {
            console.error("Console Log (Project Error):", error);
        }
    });
}

// 3. Gestion des Tâches (Ajout)
const taskForm = document.getElementById('addTaskForm');
if (taskForm) {
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const taskData = {
            title: document.getElementById('taskTitle').value,
            priority: document.getElementById('taskPriority').value,
            status: document.getElementById('taskStatus').value
        };

        try {
            const response = await fetch(API_TASKS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(taskData)
            });
            if (response.ok) {
                alert("Tâche ajoutée !");
                location.reload();
            }
        } catch (error) {
            console.error("Console Log (Task Error):", error);
        }
    });
}

// 4. Déconnexion
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });
}
async function loadTasks(projectId) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_PROJECTS}/${projectId}/tasks`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const tasks = await response.json();
        const tasksList = document.getElementById('tasksList');
        if (response.ok && tasksList) {
            tasksList.innerHTML = tasks.map(t => `
                <div style="border: 1px solid #ccc; padding: 10px; margin-top: 5px;">
                    <span>${t.title} - ${t.priority}</span>
                    <button onclick="updateTaskStatus('${t._id}', 'terminé')">Finish</button>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error(error);
    }
}

async function updateTaskStatus(taskId, newStatus) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_TASKS}/${taskId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        });
        if (response.ok) {
            location.reload();
        }
    } catch (error) {
        console.error(error);
    }
}

const taskFormElement = document.getElementById('addTaskForm');
if (taskFormElement) {
    taskFormElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const taskData = {
            title: document.getElementById('taskTitle').value,
            priority: document.getElementById('taskPriority').value,
            status: document.getElementById('taskStatus').value ,
            assignedTo: document.getElementById('taskAssignedTo').value
        };

        try {
            const response = await fetch(API_TASKS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(taskData)
            });
            if (response.ok) {
                alert("Task created successfully");
                location.reload();
            }
        } catch (error) {
            console.error(error);
        }
    });
}
async function loadMembers() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:3000/api/users', {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const members = await response.json();
            const selectElement = document.getElementById('taskAssignedTo');
            if (selectElement) {
                selectElement.innerHTML = '<option value="">Sélectionner un membre</option>' + 
                    members.map(m => `<option value="${m._id}">${m.name} (${m.email})</option>`).join('');
            }
        } else {
            console.error("Erreur lors du chargement des membres");
        }
    } catch (error) {
        console.error("Erreur réseau :", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadMembers();
});
async function loadDashboardStats() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:3000/api/dashboard/stats', {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const stats = await response.json();
            
            const activeProjects = document.getElementById('activeProjectsCount');
            const completedTasks = document.getElementById('completedTasksCount');
            const delayedTasks = document.getElementById('delayedTasksCount');
            
            if (activeProjects) activeProjects.innerText = stats.activeProjects || 0;
            if (completedTasks) completedTasks.innerText = stats.completedTasks || 0;
            if (delayedTasks) delayedTasks.innerText = stats.delayedTasks || 0;
        }
    } catch (error) {
        console.error("Erreur stats :", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof loadMembers === 'function') loadMembers();
    loadDashboardStats();
});
let currentPage = 1;
const limitPerPage = 5;

async function loadFilteredTasks() {
    const token = localStorage.getItem('token');
    const search = document.getElementById('searchQuery').value;
    const status = document.getElementById('filterStatus').value;
    const priority = document.getElementById('filterPriority').value;

    try {
        const url = `http://localhost:3000/api/tasks?page=${currentPage}&limit=${limitPerPage}&search=${search}&status=${status}&priority=${priority}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const result = await response.json();
            
            const pageNumDisplay = document.getElementById('currentPageNum');
            if (pageNumDisplay) {
                pageNumDisplay.innerText = `Page ${result.page} sur ${result.totalPages}`;
            }
        }
    } catch (error) {
        console.error("Erreur filtrage :", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const btnSearch = document.getElementById('btnSearch');
    const btnPrev = document.getElementById('btnPrevPage');
    const btnNext = document.getElementById('btnNextPage');

    if (btnSearch) {
        btnSearch.addEventListener('click', () => {
            currentPage = 1;
            loadFilteredTasks();
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                loadFilteredTasks();
            }
        });
    }

    if (btnNext) {
        btnNext.addEventListener('click', () => {
            currentPage++;
            loadFilteredTasks();
        });
    }
});
function saveTaskDraft() {
    const draft = {
        title: document.getElementById('taskTitle')?.value || '',
        priority: document.getElementById('taskPriority')?.value || '',
        status: document.getElementById('taskStatus')?.value || ''
    };
    localStorage.setItem('taskFormDraft', JSON.stringify(draft));
}

function restoreTaskDraft() {
    const savedDraft = localStorage.getItem('taskFormDraft');
    if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        if (document.getElementById('taskTitle')) document.getElementById('taskTitle').value = draft.title;
        if (document.getElementById('taskPriority')) document.getElementById('taskPriority').value = draft.priority;
        if (document.getElementById('taskStatus')) document.getElementById('taskStatus').value = draft.status;
    }
}

function clearTaskDraft() {
    localStorage.removeItem('taskFormDraft');
}

document.addEventListener('DOMContentLoaded', () => {
    restoreTaskDraft();

    const taskForm = document.getElementById('addTaskForm');
    if (taskForm) {
        taskForm.addEventListener('input', saveTaskDraft);
        taskForm.addEventListener('submit', clearTaskDraft);
    }
});
async function inviteProjectMember(e) {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    const email = document.getElementById('memberEmail').value;
    const messageElement = document.getElementById('inviteMessage');
    
    try {
        const response = await fetch('http://localhost:3000/api/projects/invite', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            if (messageElement) {
                messageElement.style.color = 'green';
                messageElement.innerText = "Membre invité avec succès !";
            }
            document.getElementById('inviteMemberForm').reset();
        } else {
            if (messageElement) {
                messageElement.style.color = 'red';
                messageElement.innerText = data.message || "Erreur lors de l'invitation.";
            }
        }
    } catch (error) {
        console.error("Erreur invitation :", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const inviteForm = document.getElementById('inviteMemberForm');
    if (inviteForm) {
        inviteForm.addEventListener('submit', inviteProjectMember);
    }
});
async function loadProjectActivities(projectId) {
    const token = localStorage.getItem('token');
    const activityList = document.getElementById('activityList');
    
    if (!projectId || !activityList) return;

    try {
        const response = await fetch(`http://localhost:3000/api/projects/${projectId}/activities`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const activities = await response.json();
            activityList.innerHTML = '';

            if (activities.length === 0) {
                activityList.innerHTML = `<li style="padding: 10px 0; color: #858796;">Aucune activité pour ce projet.</li>`;
                return;
            }

            activities.forEach(act => {
                const li = document.createElement('li');
                li.style.padding = '12px 0';
                li.style.borderBottom = '1px solid #e3e6f0';
                li.style.fontSize = '14px';
                
                const dateFormated = new Date(act.createdAt).toLocaleString('fr-FR');
                
                li.innerHTML = `<strong>[${dateFormated}]</strong> ${act.description}`;
                activityList.appendChild(li);
            });
        }
    } catch (error) {
        console.error("Erreur activités :", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const currentProjectId = localStorage.getItem('currentProjectId');
    if (currentProjectId) {
        loadProjectActivities(currentProjectId);
    }
});
async function fetchNotifications() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch('http://localhost:3000/api/notifications', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const notifications = await response.json();
            localStorage.setItem('cachedNotifications', JSON.stringify(notifications));
            renderNotifications(notifications);
        }
    } catch (error) {
        console.error("Erreur notifications :", error);
    }
}

function renderNotifications(notifications) {
    const listElement = document.getElementById('notificationList');
    const badgeElement = document.getElementById('notificationBadge');
    
    if (!listElement) return;
    listElement.innerHTML = '';

    const unreadCount = notifications.filter(n => !n.isRead).length;
    
    if (badgeElement) {
        if (unreadCount > 0) {
            badgeElement.innerText = unreadCount;
            badgeElement.style.display = 'block';
        } else {
            badgeElement.style.display = 'none';
        }
    }

    if (notifications.length === 0) {
        listElement.innerHTML = `<li style="padding: 8px; color: #858796; font-size: 13px;">Aucune notification.</li>`;
        return;
    }

    notifications.forEach(notif => {
        const li = document.createElement('li');
        li.style.padding = '10px';
        li.style.borderBottom = '1px solid #eee';
        li.style.fontSize = '13px';
        li.style.backgroundColor = notif.isRead ? 'transparent' : '#f0f4ff';
        li.style.cursor = 'pointer';
        
        li.innerText = notif.message;
        
        li.addEventListener('click', () => markNotificationAsRead(notif._id));
        listElement.appendChild(li);
    });
}

async function markNotificationAsRead(id) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:3000/api/notifications/${id}/read`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            fetchNotifications();
        }
    } catch (error) {
        console.error("Erreur lecture notification :", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const cached = localStorage.getItem('cachedNotifications');
    if (cached) {
        renderNotifications(JSON.parse(cached));
    }

    fetchNotifications();
    setInterval(fetchNotifications, 30000);

    const btn = document.getElementById('notificationBtn');
    const dropdown = document.getElementById('notificationDropdown');
    if (btn && dropdown) {
        btn.addEventListener('click', () => {
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        });
    }
});