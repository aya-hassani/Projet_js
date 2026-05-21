const Project = require('../models/Project');
const User = require('../models/User');

exports.getProjects = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    let filter = { owner: req.user.userId };

    if (status) filter.status = status;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const projects = await Project.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Project.countDocuments(filter);

    res.json({
      success: true,
      data: projects,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.createProject = async (req, res) => {
  try {
    const { title, description, deadline, status } = req.body;
    const project = await Project.create({
      title,
      description,
      deadline,
      status,
      owner: req.user.userId
    });
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 PUT /api/projects/:id
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!project) {
      return res.status(404).json({ success: false, message: 'Projet non trouvé' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.userId
    });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Projet non trouvé' });
    }
    res.json({ success: true, message: 'Projet supprimé' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.addMember = async (req, res) => {
  try {
    const { email, role } = req.body;
    const project = await Project.findOne({ _id: req.params.id, owner: req.user.userId });
    if (!project) return res.status(404).json({ message: 'Projet non trouvé' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const alreadyMember = project.members.find(m => m.user.toString() === user._id.toString());
    if (alreadyMember) return res.status(400).json({ message: 'Déjà membre' });

    project.members.push({ user: user._id, role: role || 'Collaborateur' });
    await project.save();
    res.json({ message: 'Membre ajouté', members: project.members });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.removeMember = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user.userId });
    if (!project) return res.status(404).json({ message: 'Projet non trouvé' });

    project.members = project.members.filter(m => m.user.toString() !== req.params.userId);
    await project.save();
    res.json({ message: 'Membre retiré', members: project.members });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
