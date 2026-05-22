const express = require("express");
const {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
  updateTaskStatus
} = require("../controllers/taskController");

const router = express.Router();

router.post("/projects/:projectId/tasks", createTask);
router.get("/projects/:projectId/tasks", getTasksByProject);
router.put("/tasks/:taskId", updateTask);
router.delete("/tasks/:taskId", deleteTask);
router.patch("/tasks/:taskId/status", updateTaskStatus);

module.exports = router;