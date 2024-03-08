const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const personalRecordSchema = new mongoose.Schema({
    exerciseName: {
        type: String
    },
    exerciseType: {
        type: String
    },
    record: {
        type: Number
    },
    userId: {
        type: ObjectId
    }
});

module.exports = mongoose.model('PersonalRecord', personalRecordSchema);
