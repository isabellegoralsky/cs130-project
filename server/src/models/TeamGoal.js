const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const teamGoalSchema = new mongoose.Schema({
    teamId: ObjectId,
    title: String,          // Optional.
    description: String,    // Optional.
    type: String,           // CST.
    exercise: {
        name: String,
        amount: {
            unit: String,   // SET/MIN.
            value: Number
        },
        difficulty: {       // Optional.
            unit: String,   // LB/MPH.
            value: Number
        }
    },
    progress: Number,
    createDate: Date,       // Automatically created.
    endDate: Date           // Optional.
});

module.exports = mongoose.model('TeamGoal', teamGoalSchema);