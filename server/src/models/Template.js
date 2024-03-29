const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    userId: {
        type: ObjectId
    }, 
    templateName: {
        type: [String]
    },
    exercises: {
        type: [{exerciseName: [String], sets: [Number], reps: [Number], weight: [Number]}]
    },
    note: {
        type: [String]
    }
});

module.exports = mongoose.model('Template', templateSchema);