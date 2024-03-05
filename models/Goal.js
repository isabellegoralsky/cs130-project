const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const prGoalSchema = new mongoose.Schema({
    user_id: {
        type: ObjectId
    },
    exerciseType: {
        type: String // 'CARDIO' or 'STRENGTH'
    },
    exercise: {
        type: String
    },
    target: {
        type: Number //weight in pounds for 'STRENGTH', duration in mins for 'CARDIO'
    },
    startDate: {
        type: Date
    },
    description: {
        type: String
    }
});


const consistencyGoalSchema = new mongoose.Schema({
    user_id: {
        type: ObjectId
    },
    exerciseType: {
        type: String // 'CARDIO' or 'STRENGTH'
    },
    exercise: {
        type: String
    },
    target: {
        type: Number
    },
    unit: {
        type: String //supporting 'SETS', 'REPS' for STRENGTH and 'DURATION_MINS', 'COUNT' for CARDIO
    },
    per: {
        type: String //supporting 'DAY', 'WEEK', 'MONTH' currently
    },
    startDate: {
        type: Date
    },
    description: {
        type: String
    }
});

module.exports = {
    PRGoal: mongoose.model('PRGoal', prGoalSchema),
    ConsistencyGoal: mongoose.model('ConsistencyGoal', consistencyGoalSchema)
};