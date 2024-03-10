const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    userId: ObjectId,
    title: String,
    description: String,
    type: String,       // PR, CST.
    exercise: {
        name: String,
        amount: {           // For CST.
            unit: String,   // SET, MIN, etc.
            value: Number
        },
        difficulty: {       // Necessary for PR. Optional for CST.
            unit: String,   // LB, MPH, etc.
            value: Number
        }
    },
    progress: Number,
    createDate: Date,   // Automatically created.
    endDate: Date       // Optional.
});

module.exports = {
    Goal: mongoose.model('Goal', goalSchema),
};