const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/AuthRoutes');

const app = express();

// Middleware pour lire le JSON dans les requêtes (req.body)
app.use(express.json());

// Connexion à MongoDB (Docker ou Local)
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/taskflow';
mongoose.connect(mongoURI)
    .then(() => console.log('✅ Connexion à MongoDB réussie !'))
    .catch((err) => console.error('❌ Erreur de connexion à MongoDB :', err));

// Liaison de tes routes d'authentification
app.use('/api/auth', authRoutes);

// Route de test de base
app.get('/', (req, res) => {
    res.send('Le serveur TaskFlow fonctionne parfaitement !');
});

// Définition du Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});