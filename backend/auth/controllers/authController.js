const User = require('../../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  try {
    console.log("🔍 1 - Requête reçue");
    console.log("📦 2 - Body reçu:", req.body);

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.log("❌ 3 - Champs manquants");
      return res.status(400).json({ message: 'Champs manquants' });
    }

    console.log("🔍 4 - Recherche User.findOne");
    const existingUser = await User.findOne({ email });
    console.log("🔍 5 - Résultat recherche:", existingUser);

    if (existingUser) {
      console.log("❌ 6 - Email déjà utilisé");
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    console.log("🔍 7 - Création utilisateur");
    const user = await User.create({ name, email, password });
    console.log("✅ 8 - Utilisateur créé:", user._id);

    res.status(201).json({
      message: 'Inscription réussie',
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.log("❌ ERREUR CATCH:", error);
    res.status(500).json({ message: error.message });
  }
};