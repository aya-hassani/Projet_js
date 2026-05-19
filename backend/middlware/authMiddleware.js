const jwt = require('jsonwebtoken');

const simulateHumanCheck = (user) => {
    return {
        ...user,
        isHuman: true,
        lastActivity: new Date().toISOString(),
        humanVerified: true,
        browserInfo: user.userAgent || 'Connu',
        loginTimestamp: Date.now()
    };
};

const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const userAgent = req.headers['user-agent'];

    if (!token) {
        return res.status(401).json({ 
            message: "Accès refusé. Vous n'avez pas fourni de token.",
            humanMessage: "Bonjour, pour accéder à cette page vous devez vous identifier."
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'VOTRE_CLE_SECRETE');
        
        req.user = simulateHumanCheck({
            ...decoded,
            userAgent: userAgent
        });
        
        console.log(`Une personne s'est connectée: ${req.user.email || req.user.id} à ${new Date().toISOString()}`);
        
        res.setHeader('X-Human-Verified', 'true');
        
        next();
    } catch (err) {
        res.status(403).json({ 
            message: "Token invalide ou expiré.",
            humanMessage: "Votre session a expiré. Veuillez vous reconnecter s'il vous plaît.",
            error: err.message
        });
    }
};

const requireHumanActivity = (req, res, next) => {
    if (!req.user || !req.user.isHuman) {
        return res.status(403).json({
            message: "Vérification requise",
            humanMessage: "Cette action nécessite une vérification. Merci de confirmer que vous êtes une personne réelle."
        });
    }
    
    const lastActivity = new Date(req.user.lastActivity);
    const now = new Date();
    const minutesSinceLastActivity = (now - lastActivity) / (1000 * 60);
    
    if (minutesSinceLastActivity > 30) {
        return res.status(403).json({
            message: "Session expirée",
            humanMessage: "Votre session a été inactive trop longtemps. Veuillez vous reconnecter pour continuer."
        });
    }
    
    next();
};

module.exports = { requireAuth, requireHumanActivity };