const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./backend/auth/routes/authRoutes');
const projectRoutes = require('./backend/projects/routes/projectRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/taskflow')
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.log('❌ MongoDB error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API TaskFlow fonctionne!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});