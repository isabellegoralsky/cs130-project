const mongoose = require('mongoose');

const targetGoalSchema = new mongoose.Schema({
    email: {
        type: String
    },
    exercise: {
        type: String
    },
    target: {
        type: Number
    },
    startDate: {
        type: Date
    }
});

const consistencyGoalSchema = new mongoose.Schema({
    email: {
        type: String
    },
    exercise: {
        type: String
    },
    target: {
        type: Number
    },
    per: {
        type: String //supporting 'DAY', 'WEEK', 'MONTH' currently
    },
    startDate: {
        type: Date
    }
});

module.exports = {
    TargetGoal: mongoose.model('TargetGoal', targetGoalSchema),
    ConsistencyGoal: mongoose.model('ConsistencyGoal', consistencyGoalSchema)
};