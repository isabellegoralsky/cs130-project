const mongoose = require('mongoose');

const pictureSchema = new mongoose.Schema({
    filename: String,
    contentType: String,
    image: Buffer
});

module.exports = mongoose.model('Picture', pictureSchema);