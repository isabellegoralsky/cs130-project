const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        max: 100,
        min: 4
    },
    admin: {
        type: [ObjectId]
    },
    teamMembers: {
        type: [ObjectId]
    }
});

module.exports = mongoose.model('Team', teamSchema);