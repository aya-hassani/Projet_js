document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const messageBox = document.getElementById('messageBox');
    const submitBtn = document.getElementById('submitBtn');

    if (!registerForm) return;

    registerForm.addEventListener('submit', async (e) => {
        // Empêcher le rechargement automatique de la page
        e.preventDefault(); 

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Réinitialisation visuelle de la zone d'alertes
        messageBox.innerText = '';
        messageBox.className = 'alert';
        messageBox.style.display = 'none';

        // Désactiver le bouton pendant la requête pour éviter les doubles clics
        submitBtn.disabled = true;
        submitBtn.innerText = 'Création du compte...';

        try {
            // 🚀 Envoi de la requête d'inscription avec Axios
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                name,
                email,
                password
            });

            // Affichage du succès (Les données renvoyées par Axios sont dans response.data)
            messageBox.innerText = "Compte créé avec succès ! Redirection...";
            messageBox.classList.add('alert-success');
            messageBox.style.display = 'block';

            // Vider les champs du formulaire
            registerForm.reset();

            // Redirection automatique vers la page de connexion après 2 secondes
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);

        } catch (error) {
            // Récupération propre du message d'erreur renvoyé par le backend
            const errorMessage = error.response && error.response.data && error.response.data.message 
                ? error.response.data.message 
                : "Une erreur est survenue lors de l'inscription.";
                
            messageBox.innerText = errorMessage;
            messageBox.classList.add('alert-danger');
            messageBox.style.display = 'block';
            
            // Réactiver le bouton en cas d'échec pour permettre de corriger
            submitBtn.disabled = false;
            submitBtn.innerText = "S'inscrire";
        }
    });
});