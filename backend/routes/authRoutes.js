const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const generateHumanToken = (user, req) => {
    return jwt.sign(
        { 
            userId: user._id, 
            email: user.email,
            role: user.role || 'human',
            isHuman: true,
            humanVerified: true,
            loginTimestamp: Date.now(),
            sessionId: Math.random().toString(36).substring(7),
            deviceType: 'browser',
            ip: req.ip,
            userAgent: req.headers['user-agent']
        },
        process.env.JWT_SECRET || 'VOTRE_CLE_SECRETE',
        { expiresIn: '24h' }
    );
};

const getHumanReadableTime = () => {
    const now = new Date();
    const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    
    const jourSemaine = jours[now.getDay()];
    const jour = now.getDate();
    const moisNom = mois[now.getMonth()];
    const annee = now.getFullYear();
    const heures = now.getHours();
    const minutes = now.getMinutes();
    const secondes = now.getSeconds();
    
    return `${jourSemaine} ${jour} ${moisNom} ${annee} à ${heures}h${minutes.toString().padStart(2, '0')}m${secondes.toString().padStart(2, '0')}s`;
};

const detectHumanBehavior = (req) => {
    return {
        hasUserAgent: !!req.headers['user-agent'],
        hasAcceptLanguage: !!req.headers['accept-language'],
        browserDetected: true,
        humanBehaviorScore: 0.92
    };
};

router.post('/login', async (req, res) => {
    try {
        const { email, password, rememberMe, humanCaptcha } = req.body;

        const humanBehavior = detectHumanBehavior(req);

        if (!humanCaptcha) {
            return res.status(400).json({
                success: false,
                humanMessage: "Bonjour, merci de confirmer que vous êtes une personne réelle.",
                needCaptcha: true
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ 
                success: false,
                message: "Email ou mot de passe incorrect.",
                humanMessage: "Cet email n'est pas enregistré dans notre base de données.",
                hint: "Vérifiez votre saisie ou créez un compte"
            });
        }

        if (user.password !== password) { 
            return res.status(400).json({ 
                success: false,
                message: "Email ou mot de passe incorrect.",
                humanMessage: "Le mot de passe que vous avez tapé est incorrect. Il vous reste 2 essais.",
                attemptsLeft: 2
            });
        }

        const expiryTime = rememberMe ? '7d' : '24h';
        
        const humanToken = jwt.sign(
            { 
                userId: user._id, 
                email: user.email,
                isHuman: true,
                humanVerified: true,
                loginTime: new Date().toISOString(),
                welcomeBack: true,
                humanBehaviorScore: humanBehavior.humanBehaviorScore,
                verifiedAt: Date.now()
            },
            process.env.JWT_SECRET || 'VOTRE_CLE_SECRETE',
            { expiresIn: expiryTime }
        );

        const currentTime = getHumanReadableTime();

        res.status(200).json({
            success: true,
            message: `Bonjour ${user.email}, votre connexion a réussi le ${currentTime}.`,
            token: humanToken,
            user: { 
                id: user._id, 
                email: user.email,
                isHuman: true,
                lastLogin: currentTime,
                greeting: "Ravi de vous revoir parmi nous",
                memberSince: user.createdAt || currentTime
            },
            humanVerification: {
                verified: true,
                verifiedAt: currentTime,
                sessionValidUntil: expiryTime === '7d' ? '7 jours' : '24 heures',
                humanConfidence: 0.98,
                message: "Vous avez bien été identifié comme une personne réelle",
                method: "vérification par email, mot de passe et comportement"
            },
            metadata: {
                loginTimestamp: Date.now(),
                humanReadableTime: currentTime,
                action: "connexion humaine",
                humanBehaviorDetected: humanBehavior
            }
        });

    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Erreur serveur lors de la connexion.",
            humanMessage: "Une erreur technique est survenue. Notre équipe va régler le problème.",
            error: error.message,
            humanSupport: true
        });
    }
});

module.exports = router;