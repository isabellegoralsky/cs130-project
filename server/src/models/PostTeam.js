const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const postteamSchema = new mongoose.Schema({
    userId: {
        type: ObjectId
    },
    teamId: {
        type: ObjectId
    },
    title: {
        type: String
    },
    note: {
        type: String
    }
}, 
{timestamps: true});

module.exports = mongoose.model('PostTeam', postteamSchema);