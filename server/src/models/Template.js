const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    userId: {
        type: ObjectId
    }, 
    workoutName: {
        type: [String]
    },
    exercises: {
        type: [{exerciseName: [String], sets: [Number], reps: [Number]}]
    },
    note: {
        type: [String]
    }
});

module.exports = mongoose.model('Template', templateSchema);