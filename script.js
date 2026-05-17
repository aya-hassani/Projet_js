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
                alert("Task created successfully");
                location.reload();
            }
        } catch (error) {
            console.error(error);
        }
    });
}
