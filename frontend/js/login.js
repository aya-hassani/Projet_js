document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const messageDiv = document.getElementById('message');

    if (!loginBtn) return;

    loginBtn.addEventListener('click', async () => {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Réinitialisation de l'affichage des messages
        messageDiv.innerText = '';
        messageDiv.className = 'alert';
        messageDiv.style.display = 'none';

        // Validation basique
        if (!email || !password) {
            messageDiv.innerText = 'Veuillez remplir tous les champs.';
            messageDiv.classList.add('alert-danger');
            messageDiv.style.display = 'block';
            return;
        }

        try {
            // 🚀 Connexion avec Axios vers l'endpoint de Login
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });

            // Avec Axios, les données du serveur sont dans response.data
            const data = response.data;

            // 💾 EXIGENCE PROF : Stocker le Token JWT et les infos de l'utilisateur
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            messageDiv.innerText = "Connexion réussie ! Redirection...";
            messageDiv.classList.add('alert-success');
            messageDiv.style.display = 'block';

            // Redirection vers le tableau de bord (index.html)
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);

        } catch (error) {
            // Récupération propre du message d'erreur renvoyé par le backend
            const errorMessage = error.response && error.response.data && error.response.data.message 
                ? error.response.data.message 
                : "Identifiants incorrects ou serveur injoignable.";
                
            messageDiv.innerText = errorMessage;
            messageDiv.classList.add('alert-danger');
            messageDiv.style.display = 'block';
        }
    });
});