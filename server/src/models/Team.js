const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        max: 100,
        min: 4
    },
    admin: {
        type: [String]
    },
    teamMembers: {
        type: [String]
    }
});

module.exports = mongoose.model('Team', teamSchema);