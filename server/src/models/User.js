const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        max: 100,
        min: 4
    },
    lastName: {
        type: String,
        max: 100,
        min: 4
    },
    email: {
        type: String,
        min: 6,
        max: 200
    },
    password: {
        type: String,
        max: 1024,
        min: 6
    },
    following: {
        type: [ObjectId]
    },
    teams: {
        type: [ObjectId]
    },
    profilePicture: {
        type: ObjectId,
        default: null
    }
});

module.exports = mongoose.model('User', userSchema);