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
