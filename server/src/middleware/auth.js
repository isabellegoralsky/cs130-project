const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function authenticateToken(req, res, next) {
    const token = req.cookies.jwt;
    if (!token) return res.status(400).send('Token not found.');
    const decoded = jwt.verify(token, process.env.TokenSecret);
    const userId = decoded.id;
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(400).send('Invalid token.');
    req.user = user;
    next();
}

module.exports = { authenticateToken }