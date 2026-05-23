const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Importation des routes
const authRoutes = require('./routes/AuthRoutes'); // Note la majuscule "AuthRoutes" pour correspondre à ton fichier
const projectRoutes = require('./routes/projectRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json()); // Permet de lire le JSON dans req.body

// Connexion à MongoDB (Docker, Distant ou Local)
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/taskflow';
mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connexion à MongoDB réussie !'))
  .catch((err) => console.error('❌ Erreur de connexion à MongoDB :', err));

// Liaison des routes de l'API
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api', dashboardRoutes);

// Route de test de base
app.get('/', (req, res) => {
  res.json({ message: 'Le serveur TaskFlow fonctionne parfaitement !' });
});

// Définition du Port et démarrage
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
