const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        priorite: {
            type: String,
            enum: ["basse","moyenne","haute"],
            required: true,
        },
        statut: {
            type: String,
            enum: ["à faire", "en cours", "terminé"],
            required: true,
        },
        projet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("Task", taskSchema);