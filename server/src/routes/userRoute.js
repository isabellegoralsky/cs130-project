const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const { authenticateToken } = require('../middleware/auth');
const User = require('../models/User');
const Team = require('../models/Team');
const Picture = require('../models/Picture');

const maxAge = 30 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({
        id
    }, process.env.TokenSecret, {
        expiresIn: maxAge
    });
}

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', authenticateToken, async (req, res) => {
    res.status(200).send(req.user);
});

router.put('/', authenticateToken, async (req, res) => {
    const update = {
        ...(req.body.firstName && { firstName: req.body.firstName }),
        ...(req.body.lastName && { lastName: req.body.lastName }),
        ...(req.body.email && { email: req.body.email }),
        ...(req.body.password && { password: req.body.password })
    }

    try {
        await User.updateOne({ _id: req.user._id }, update);
        console.log('Successfully updated User');
        res.status(200).send('Successfully updated User');
    } catch (err) {
        console.log('Failed to update User.');
        res.status(400).send('Failed to update User');
    }
});

router.post("/register", async (req, res) => {
    const emailExists = await User.findOne({
        email: req.body.email
    });
    if (emailExists) return res.status(400).send('Already have an account');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        profilePicture: null
    });
    try {
        const saveUser = await user.save();
        const token = createToken(saveUser._id);
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge
        });
        console.log("Successfully registered");
        res.status(200).send("Successfully registered");
    } catch (err) {
        console.log("Failed to register");
        res.status(400).send(err);
    }
});

router.post("/login", async (req, res) => {
    const user = await User.findOne({
        email: req.body.email
    });
    if (user) {
        const auth = await bcrypt.compare(req.body.password, user.password);
        if (auth) {
            try {
                const token = createToken(user._id);
                res.cookie('jwt', token, {
                    httpOnly: true,
                    maxAge: maxAge
                });
                console.log("Successfully logged in");
                res.status(200).send("Logged in")
            } catch (err) {
                console.log("Failed to login");
                res.status(400).send(err);
            }
        }
        else {
            return res.status(400).send('Incorrect password');
        }
    }
    else {
        return res.status(400).send('No account found');
    }
});

router.post("/logout", async (req, res) => {
    try {
        res.cookie('jwt', '', {
            maxAge: 1
        });
        console.log("Log out");
        res.status(200).send("Logged out");
    } catch (err) {
        console.log("Could not log out")
        res.status(400).send(err);
    }
});

router.post("/addfriend/:uid", async (req, res) => {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.TokenSecret);
    var userId = decoded.id;
    const user = await User.findOne({
        _id: userId
    });
    if (!user) return res.status(400).send('User is not found.');
    const friend = await User.findOne({
        _id: req.params.uid
    });
    if (!friend) return res.status(400).send('Friend is not found.');
    User.findOneAndUpdate({
        _id: userId
    }, {
        $push: {
            following: friend._id
        }
    }, {
        new: true
    }, (err, doc) => {
        if (err) {
            console.log("Something went wrong");
            res.status(400).send(err);
        }
    });
    console.log("Successfully followed user.");
    res.status(200).send("Successfully followed user.");
});

router.post("/deletefriend/:uid", async (req, res) => {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.TokenSecret);
    var userId = decoded.id;
    const user = await User.findOne({
        _id: userId
    });
    if (!user) return res.status(400).send('User is not found.');
    const friend = await User.findOne({
        _id: req.params.uid
    });
    if (!friend) return res.status(400).send('Friend is not found.');
    User.findOneAndUpdate({
        _id: userId
    }, {
        $pull: {
            following: friend._id
        }
    }, {
        new: true
    }, (err, doc) => {
        if (err) {
            console.log("Something went wrong");
            res.status(400).send(err);
        }
    });
    res.status(200).send("Successfully removed friend.")
});

router.post("/createteam", async (req, res) => {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.TokenSecret);
    var userId = decoded.id;
    const user = await User.findOne({
        _id: userId
    });
    if (!user) return res.status(400).send('User is not found.');
    const teamExists = await Team.findOne({
        teamName: req.body.teamName
    });
    if (teamExists) return res.status(400).send('Team already exists');
    const team = new Team({
        teamName: req.body.teamName,
        admin: [user._id],
        teamMembers: [user._id]
    });
    try {
        const saveTeam = await team.save();
        User.findOneAndUpdate({
            _id: userId
        }, {
            $push: {
                teams: team._id
            }
        }, {
            new: true
        }, (err, doc) => {
            if (err) {
                console.log("Something went wrong");
                res.status(400).send(err);
            }
        });
        console.log("Successfully created team");
        res.status(200).send("Successfully created team")
    } catch (err) {
        console.log("Failed to create team");
        res.status(400).send(err);
    }
});

router.post("/jointeam", async (req, res) => {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.TokenSecret);
    var userId = decoded.id;
    const user = await User.findOne({
        _id: userId
    });
    if (!user) return res.status(400).send('User is not found.');
    const teamExists = await Team.findOne({
        teamName: req.body.teamName
    });
    if (teamExists === null) return res.status(400).send('Team not found');
    Team.findOneAndUpdate({
        teamName: teamExists._id
    }, {
        $push: {
            teamMembers: userId
        }
    }, {
        new: true
    }, (err, doc) => {
        if (err) {
            console.log("Something went wrong");
            res.status(400).send(err);
        }
    });
    User.findOneAndUpdate({
        _id: userId
    }, {
        $push: {
            teams: teamExists._id
        }
    }, {
        new: true
    }, (err, doc) => {
        if (err) {
            console.log("Something went wrong");
            res.status(400).send(err);
        }
    });
    console.log("Successfully joined team.");
    res.status(200).send("Successfully joined team.");
});

router.post("/leaveteam", async (req, res) => {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.TokenSecret);
    var userId = decoded.id;
    const user = await User.findOne({
        _id: userId
    });
    if (!user) return res.status(400).send('User is not found.');
    const teamExists = await Team.findOne({
        teamName: req.body.teamName
    });
    if (teamExists === false) return res.status(400).send('Team not found');
    Team.findOneAndUpdate({
        teamName: req.body.teamName
    }, {
        $pull: {
            teamMembers: user.email,
            admin: user.email
        }
    }, {
        new: true
    }, (err, doc) => {
        if (err) {
            console.log("Something went wrong");
            res.status(400).send(err);
        }
    });
    if (teamExists.admin.includes(user.email)) {
        Team.findOneAndUpdate({
            teamName: req.parems.id
        }, {
            $push: {
                admin: teamExists.teamMembers[1]._id
            }
        }, {
            new: true
        }, (err, doc) => {
            if (err) {
                console.log("Something went wrong");
                res.status(400).send(err);
            }
        });
    }
    User.findOneAndUpdate({
        _id: userId
    }, {
        $pull: {
            teams: teamExists._id
        }
    }, {
        new: true
    }, (err, doc) => {
        if (err) {
            console.log("Something went wrong");
            res.status(400).send(err);
        }
    });
    console.log("Successfully left team.");
    res.status(200).send("Successfully left team.");
});

router.post("/profile-picture", authenticateToken, upload.single('image'), async (req, res) => {
    const picture = new Picture({
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        image: req.file.buffer
    });
    try {
        await picture.save();
        await User.updateOne({ _id: req.user._id }, { profilePicture: picture._id });
        console.log('Successfully saved picture');
        res.status(200).send('Successfully saved picture');
    } catch (err) {
        console.log('Failed to save picture');
        console.log(err);
        res.status(400).send('Failed to save picture');
    }
});

module.exports = router;