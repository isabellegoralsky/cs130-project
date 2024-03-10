const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const teamGoalSchema = new mongoose.Schema({
    teamId: ObjectId,
    title: {                                // Optional
        type: String,
        default: null
    },
    description: {                          // Optional
        type: String,
        default: null
    },
    type: { type: String },                 // CST
    exercise: {
        type: {
            name: { type: String },
            amount: {
                unit: { type: String },     // SET/MIN
                value: { type: Number }
            }
        }
    },
    progress: {                             // Optional
        type: Number,
        default: 0
    },
    endsAt: {                               // Optional
        type: Date,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('TeamGoal', teamGoalSchema);