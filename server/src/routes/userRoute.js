const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const { authenticateToken } = require('../middleware/auth');
const User = require('../models/User');
const Team = require('../models/Team');
const Picture = require('../models/Picture');
const Post = require('../models/Post');
const PostTeam = require('../models/PostTeam');
const { Goal } = require('../models/Goal');
const Template = require('../models/Template');
const PersonalRecord = require('../models/PersonalRecord');

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

/**
   * Return user.
   *
   * @name  GetUser
   * @route   {GET} routes/userRoute/
   * @routeparam {authenticateToken} authenticateToken - contains an access token for the user account.
   * @routeparam {request} req - contains field 'user' to know which user to access.
   */
router.get('/', authenticateToken, async (req, res) => {
    res.status(200).send(req.user);
});

/**
   * Update user.
   *
   * @name  UpdateUser
   * @route   {PUT} routes/userRoute/
   * @routeparam {authenticateToken} authenticateToken - contains an access token for the user account.
   * @routeparam {request} req - contains field 'body' to access the user's info.
   */
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
        res.status(200).json('Successfully updated User');
    } catch (err) {
        console.log('Failed to update User.');
        res.status(400).json('Failed to update User');
    }
});

/**
   * Register user.
   *
   * @name  RegisterUser
   * @route   {POST} routes/userRoute/register
   * @routeparam {request} req - contains field 'body' to access the input info.
   */
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
        res.status(200).json('Successfully registered');
    } catch (err) {
        console.log("Failed to register");
        res.status(400).send(err);
    }
});

/**
   * Login user.
   *
   * @name  LoginUser
   * @route   {POST} routes/userRoute/login
   * @routeparam {request} req - contains field 'body' to access the input info.
   */
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
                res.status(200).json('Successfully logged in');
            } catch (err) {
                console.log("Failed to login");
                res.status(400).json(err);
            }
        }
        else {
            return res.status(400).json('Incorrect password');
        }
    }
    else {
        return res.status(400).json('No account found');
    }
});

/**
   * Logout user.
   *
   * @name  LogoutUser
   * @route   {POST} routes/userRoute/logout
   */
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

/**
   * Add a friend.
   *
   * @name  AddFriend
   * @route   {POST} routes/userRoute/addfriend/:email
   * @routeparam {request} req - contains fields (cookies, params) to access the user's info and friend by their email.
   */
router.post("/addfriend/:email", async (req, res) => {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.TokenSecret);
    var userId = decoded.id;
    const user = await User.findOne({
        _id: userId
    });
    if (!user) return res.status(400).json('User is not found.');
    const friend = await User.findOne({
        email: req.params.email
    });
    if (!friend) return res.status(400).json('Friend is not found.');
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
            res.status(400).json(err);
        }
    });
    console.log("Successfully followed user.");
    res.status(200).json("Successfully followed user.");
});

/**
   * Delete a friend.
   *
   * @name  DeleteFriend
   * @route   {POST} routes/userRoute/deletefriend/:uid
   * @routeparam {request} req - contains fields (cookies, params) to access the user's info and friend user id.
   */
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

/**
   * Create a team.
   *
   * @name  CreateTeam
   * @route   {POST} routes/userRoute/createteam
   * @routeparam {request} req - contains fields (cookies, params) to access the user's info, team members, and name.
   */
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

/**
   * Join a team.
   *
   * @name  JoinTeam
   * @route   {POST} routes/userRoute/jointeam/:teamname
   * @routeparam {request} req - contains fields (cookies, params) to access the user's info and find team by name.
   */
router.post("/jointeam/:teamname", async (req, res) => {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.TokenSecret);
    var userId = decoded.id;
    const user = await User.findOne({
        _id: userId
    });
    if (!user) return res.status(400).send('User is not found.');
    const teamExists = await Team.findOne({
        teamName: req.params.teamname
    });
    if (teamExists === null) return res.status(400).send('Team not found');
    Team.findOneAndUpdate({
        _id: teamExists._id
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

/**
   * Leave a team.
   *
   * @name  LeaveTeam
   * @route   {POST} routes/userRoute/leaveteam
   * @routeparam {request} req - contains fields (cookies, body) to access the user's info and find team by name.
   */
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

/**
   * Upload Profile Picture for user account.
   *
   * @name  UploadProfilePic
   * @route   {POST} routes/userRoute/profile-picture
   * @routeparam {authenticateToken} authenticateToken - contains an access token for the user account.
   * @routeparam {request} req - contains field 'file' to access the uploaded image.
   */
router.post("/profile-picture", authenticateToken, upload.single('image'), async (req, res) => {
    console.log(req.file)
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

/**
   * Return teams that a user is in.
   *
   * @name  GetUserTeams
   * @route   {GET} routes/userRoute/:uid/teams
   * @routeparam {request} req - contains field 'params' to access the user id.
   */
router.get('/:uid/teams', async (req, res) => {
    const user = await User.findOne({ _id: req.params.uid });
    if (!user) return res.status(400).send('User was not found.');
    var teams = user.teams;
    var teaminfo = [];
    for(let i=0; i<teams.length; i++){
        var team = await Team.findOne({_id: teams[i]});
        teaminfo.push({name: team.teamName, id: team._id});
    }
    return res.status(200).json(teaminfo);
});

/**
   * Return a team's members.
   *
   * @name  GetTeamMembers
   * @route   {GET} routes/userRoute/:tid/teammembers
   * @routeparam {request} req - contains field 'params' to access the team id.
   */
router.get('/:tid/teammembers', async (req, res) => {
    const team = await Team.findOne({ _id: req.params.tid });
    if (!team) return res.status(400).send('Team was not found.');
    var users = team.teamMembers;
    return res.status(200).json(users);
});

/**
   * Return a user's following.
   *
   * @name  GetFollowing
   * @route   {GET} routes/userRoute/:uid/following
   * @routeparam {request} req - contains field 'params' to access the user id.
   */
router.get('/:uid/following', async (req, res) => {
    const user = await User.findOne({ _id: req.params.uid });
    if (!user) return res.status(400).send('User was not found.');
    var following = user.following;
    return res.status(200).json(following);
});

/**
   * Return a teampage.
   *
   * @name  GetTeamPage
   * @route   {GET} routes/userRoute/:tid/teampage
   * @routeparam {request} req - contains field 'params' to access the team id.
   */
router.get('/:tid/teampage', async (req, res) => {
    const team = await Team.findOne({ _id: req.params.tid });
    if (!team) return res.status(400).send('Team was not found.');
    var users = team.teamMembers;
    var teamName = team.teamName;


    const teamposts = await PostTeam.find({ userId: { $in: team.teamMembers } }).catch(err => {
        console.error('Error:', err);
    });
    var posts = [];
    for (let i = 0; i < teamposts.length; i++) {
        const userid = teamposts[i].userId;
        const user = await User.findOne({ _id: userid });
        if (!user) return res.status(400).send('User was not found.');
        var name = user.firstName + " " + user.lastName;
        var title = teamposts[i].title;
        var note = teamposts[i].note;
        var date = (teamposts[i].updatedAt.getMonth() + 1) + '/' + teamposts[i].updatedAt.getDate() + '/' + teamposts[i].updatedAt.getFullYear();
        var time = (teamposts[i].updatedAt.getHours() + ':' + teamposts[i].updatedAt.getMinutes() + ':' + teamposts[i].updatedAt.getSeconds());
        posts.push({ name: name, title: title, note: note, date: date, time: time });
    }
    var announcements = posts;




    var teampost = await Post.find({ userId: { $in: team.teamMembers } }).catch(err => {
        console.error('Error:', err);
    });
    var posts = [];
    for (let i = 0; i < teampost.length; i++) {
        const userid = teampost[i].userId;
        const user = await User.findOne({ _id: userid });
        if (!user) return res.status(400).send('User was not found.');
        var name = user.firstName + " " + user.lastName;
        var title = teampost[i].title;
        var exercises = teampost[i].exercises;
        var description = teampost[i].description;
        var date = (teampost[i].updatedAt.getMonth() + 1) + '/' + teampost[i].updatedAt.getDate() + '/' + teampost[i].updatedAt.getFullYear();
        var time = (teampost[i].updatedAt.getHours() + ':' + teampost[i].updatedAt.getMinutes() + ':' + teampost[i].updatedAt.getSeconds());
        posts.push({ name: name, title: title, exercises: exercises, description: description, date: date, time: time });
    }
    var teampost = posts;
    var teamPage = { users, teamName, announcements, teampost };
    console.log(teamPage);
    return res.status(200).json(teamPage);
});

module.exports = router;