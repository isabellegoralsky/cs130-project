const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    userId: ObjectId,
    title: String,          // Optional.
    description: String,    // Optional.
    type: String,           // PR/CST.
    exercise: {
        name: String,
        amount: {           // Empty for PR. Necessary for CST.
            unit: String,   // SET/MIN.
            value: Number
        },
        difficulty: {       // Necessary for PR. Optional for CST.
            unit: String,   // LB/MPH.
            value: Number
        }
    },
    progress: Number,
    createDate: Date,       // Automatically created.
    endDate: Date           // Optional.
});

module.exports = {
    Goal: mongoose.model('Goal', goalSchema),
};