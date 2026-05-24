const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const AuthRoutes = require('./routes/AuthRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/taskflow')
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.log('❌ MongoDB error:', err));

app.use('/api/auth', AuthRoutes);
app.use('/api/projects', projectRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API TaskFlow fonctionne!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});