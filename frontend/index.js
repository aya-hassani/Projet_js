document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Changer le type du bouton dans le HTML de type="button" à type="submit" 
    // ou intercepter la soumission du formulaire ici :
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Empêche le rechargement de la page

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Message de chargement ou réinitialisation des anciennes erreurs visuelles
        removeExistingAlerts();

        try {
            // Requête vers ton backend Node/Express (ajuste l'URL complète si nécessaire, ex: http://localhost:5000/api/auth/login)
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Identifiants incorrects.');
            }

            // --- SUCCÈS ---
            // 1. Stocker le token JWT et les infos de l'utilisateur dans le localStorage
            localStorage.setItem('token', data.token);
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }

            // 2. Rediriger vers le tableau de bord
            window.location.href = 'dashboard.html';

        } catch (error) {
            // --- ERREUR ---
            // Afficher l'erreur proprement à l'utilisateur
            showAlert(error.message);
        }
    });

    // Utilitaires pour afficher les messages d'erreur proprement dans l'interface
    function showAlert(message) {
        const alertDiv = document.createElement('div');
        alertDiv.id = 'login-alert';
        alertDiv.style.color = '#e41e3f';
        alertDiv.style.backgroundColor = '#fae9eb';
        alertDiv.style.padding = '10px';
        alertDiv.style.borderRadius = '6px';
        alertDiv.style.marginBottom = '15px';
        alertDiv.style.fontSize = '14px';
        alertDiv.innerText = message;

        // Insère l'alerte juste au-dessus du formulaire
        loginForm.insertBefore(alertDiv, loginForm.firstChild);
    }

    function removeExistingAlerts() {
        const oldAlert = document.getElementById('login-alert');
        if (oldAlert) oldAlert.remove();
    }
});