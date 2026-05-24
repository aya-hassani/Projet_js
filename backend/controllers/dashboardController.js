const Task = require("../models/Task");

const getDashboard = async (req, res) => {
    try {
        const stats = await Task.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboard };
