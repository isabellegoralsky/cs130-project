const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    userId: { type: ObjectId },
    title: {                                // Optional
        type: String,
        default: null
    },
    description: {                          // Optional
        type: String,
        default: null
    },
    type: { type: String },                 // PR/CST
    exercise: {
        type: {
            name: { type: String },
            amount: {
                unit: { type: String },     // LB/MPH for PR. SET/MIN for CST
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

module.exports = mongoose.model('Goal', goalSchema);