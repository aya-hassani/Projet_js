const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // 1. Vérifier si le token est présent dans les headers HTTP (Bearer Token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extraire le token (on sépare "Bearer <token>" pour ne garder que le token)
            token = req.headers.authorization.split(' ')[1];

            // 2. Décoder et vérifier le token avec la clé secrète
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'MaCleSecreteUltraSecuriseeTaskFlow2026!');

            // 3. Récupérer l'utilisateur correspondant à l'ID du token (sans son mot de passe)
            req.user = await User.findById(decoded.id).select('-password');

            // Passer au contrôleur suivant (ex: getMe)
            next();
        } catch (error) {
            res.status(401).json({ message: "Accès refusé, token invalide ou expiré" });
        }
    }

    // Si aucun token n'est trouvé dans les headers
    if (!token) {
        res.status(401).json({ message: "Accès non autorisé, aucun token fourni" });
    }
};

module.exports = { protect };