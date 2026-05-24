const Task = require("../models/Task");
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priorite, statut } = req.body;
    const { projectId } = req.params; 
    const task = new Task({
      title,
      description,
      dueDate,
      priorite,
      statut,
      project: projectId
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const tasks = await Task.find({ project: projectId });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params; 
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      req.body,
      { new: true, runValidators: true } 
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Tâche introuvable" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: "Tâche introuvable" });
    }

    res.status(200).json({ message: "Task supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { statut } = req.body;

    const task = await Task.findByIdAndUpdate(
      taskId,
      { statut },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Tâche introuvable" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
  updateTaskStatus
};