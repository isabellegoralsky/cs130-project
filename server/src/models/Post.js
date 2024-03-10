const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: {
        type: ObjectId
    },
    title: {
        type: String
    },
    exercises: {
        type: {exerciseName: [String], sets: [Number], reps: [Number]}
    },
    description: {
        type: String
    }
}, 
{timestamps: true});

module.exports = mongoose.model('Post', postSchema);