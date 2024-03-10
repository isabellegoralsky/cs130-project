const express = require("express");
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const bcrypt = require('bcryptjs');

dotenv.config();

const PORT = process.env.PORT || 3001;

const app = express();
const corsOptions = {
    origin: ['http://localhost:8080', "http://codede-appli-fvdybbpwqa6p-642374602.us-east-1.elb.amazonaws.com:8080"], //  frontend origin
    credentials: true,
  };
  app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser());

mongoose.set('strictQuery', true);
mongoose.connect(process.env.DBConnect, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

const userRoute = require('./routes/userRoute');
app.use('/user', userRoute);
const profileRoute = require('./routes/profileRoute');
app.use('/profile', profileRoute);
const personalRecordRoute = require('./routes/personalRecordRoute');
app.use('/personalrecord', personalRecordRoute);
const postRoute = require('./routes/postRoute');
app.use('/post', postRoute);
const goalRoute = require('./routes/goalRoute');
app.use('/goal', goalRoute);
const teamGoalRoute = require('./routes/teamGoalRoute');
app.use('/team-goal', teamGoalRoute);
const pictureRoute = require('./routes/pictureRoute');
app.use('/picture', pictureRoute);

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});