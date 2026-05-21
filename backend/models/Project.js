const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  deadline: { type: Date, default: null },
  status: { type: String, enum: ['actif', 'en pause', 'archivé'], default: 'actif' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      role: { type: String, enum: ['Collaborateur', 'Lecture seule'], default: 'Collaborateur' }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);