const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Le nom complet est obligatoire"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "L'adresse email est obligatoire"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Veuillez fournir un email valide"]
    },
    password: {
        type: String,
        required: [true, "Le mot de passe est obligatoire"],
        minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"]
    }
}, {
    timestamps: true // Crée automatiquement les champs createdAt et updatedAt
});

// Middleware Mongoose : Hacher le mot de passe automatiquement avant de sauvegarder l'utilisateur
UserSchema.pre('save', async function(next) {
    // Si le mot de passe n'a pas été modifié, on passe à la suite
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Générer un sel (salt) et hacher le mot de passe
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Méthode personnalisée pour vérifier si le mot de passe correspond
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Sécurité ou compatibilité : on ajoute aussi comparePassword au cas où tes contrôleurs l'utiliseraient
UserSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
