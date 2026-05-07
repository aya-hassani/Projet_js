const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
router.post("/", async (req, res) => {
    try{
        const task = await Task.create(req.body);
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json(err);
    }
});
router.get("/", async(req, res) => {
    try {
        const userId = req.user._id;
        const tasks = await Task.find({ assignedTo: userId}).populate("assignedTo", "name email");
        res.json(tasks);
    } catch (err) {
        res.status(500).json(err);
    }
});
router.put("/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true,});
        res.json(task);
    } catch (err) {
        res.status(400).json(err);
    }
});
router.delete("/:id", async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "Task supprimée"});
    } catch (err) {
        res.status(500).json(err);
    }
});
router.patch("/:id/status", async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id,{ status: req.body.status },{ new: true});
        res.json(task);
    } catch (err) {
        res.status(400).json(err);
    }
});
module.exports = router;