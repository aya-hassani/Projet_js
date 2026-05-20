const Project = require('../models/Project');
// const Task = require('../models/Task');   // Commenté car Personne 3 n'a pas encore ajouté Task

exports.getProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const projects = await Project.find({ owner: req.user.userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Project.countDocuments({ owner: req.user.userId });

    res.json({
      success: true,
      data: projects,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
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
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user.userId });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Projet non trouve' });
    }
    const { title, description, deadline, status } = req.body;
    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (deadline !== undefined) project.deadline = deadline;
    if (status !== undefined) project.status = status;
    await project.save();
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user.userId });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Projet non trouve' });
    }
   // await Task.deleteMany({ project: req.params.id });   // Commenté temporairement
    await Project.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Projet supprime' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};