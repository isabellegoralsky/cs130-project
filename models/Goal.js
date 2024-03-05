const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const exercise = new mongoose.Schema({
    exerciseType: String, // 'CARDIO' or 'STRENGTH'
    exercise: String,
    unit: String, //'DURATION_MINS' for 'CARDIO, 'POUNDS' for 'STRENGTH'. Can be extended to support 'DISTANCE' for cardio, etc.
    amount: Number, 
    sets: Number,
    reps: Number
})
const samplepost = new mongoose.Schema({
    user_id: ObjectId,
    date: Date,
    exercises: [exercise],
    note: String
})

const prGoalSchema = new mongoose.Schema({
    user_id: {
        type: ObjectId,
        required: true
    },
    exerciseType: {
        type: String, // 'CARDIO' or 'STRENGTH'
        required: true
    }, 
    exercise: {
        type: String,
        required: true
    },
    target: { 
        type: Number, //weight in pounds for 'STRENGTH', duration in mins for 'CARDIO'
        required: true
    }, 
    startDate: Date,
    description: String
});


const consistencyGoalSchema = new mongoose.Schema({
    user_id: {
        type: ObjectId,
        required: true
    },
    exerciseType: {
        type: String, // 'CARDIO' or 'STRENGTH'
        required: true,
    }, 
    exercise: {
        type: String,
        required: true
    },
    target: {
        type: Number,
        required: true,
    },
    unit: {
        type: String,  //supporting 'SETS', 'REPS', 'COUNT' for STRENGTH and 'DURATION_MINS', 'COUNT' for CARDIO
        required: true,
    },
    per: {
        type: String, //supporting 'DAY', 'WEEK', 'MONTH' currently
        required: true
    },
    startDate: Date,
    description: String
});

module.exports = {
    PRGoal: mongoose.model('PRGoal', prGoalSchema),
    ConsistencyGoal: mongoose.model('ConsistencyGoal', consistencyGoalSchema),
    SamplePost: mongoose.model('samplepost', samplepost)
};