const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/auth');
const User = require('../models/User');
const Team = require('../models/Team');
const Post = require('../models/Post');
const PostTeam = require('../models/PostTeam');
const Goal = require('../models/Goal');
const TeamGoal = require('../models/TeamGoal');
const PersonalRecord = require('../models/PersonalRecord');

/**
   * Add a user's post. Then, update the user's personal records, individual goals, and team goals if applicable.
   *
   * @name  addpost
   * @route   {POST} routes/postRoute/addpost
   * @routeparam {authenticateToken} authenticateToken - contains an access token for the user account.
   * @routeparam {request} req - contains fields (user, body, cookies) to access the user requesting and the request details.
   */
router.post('/addpost', authenticateToken, async (req, res) => {
    const user = req.user;

    const post = new Post({
        userId: user._id,
        title: req.body.title,
        exercises: req.body.exercises,
        description: req.body.description
    });

    try {
        await post.save();
        console.log('Posted');
    } catch (err) {
        console.log('Failed to post');
        res.status(400).json(err);
    }

    //make new pr
    console.log(user._id);
    const personalrecord = await PersonalRecord.find({userId:user._id}).catch(err => {
        console.error('Error:', err);
    });
    var prnames = [];
    for(let i=0; i<personalrecord.length; i++){
        prnames.push(personalrecord[i].exerciseName);
    }
    var postnames = post.exercises.exerciseName;
    for(let i=0; i<postnames.length; i++){
        if(prnames.includes(postnames[i])===false){
            var newpr = new PersonalRecord({
                exerciseName: postnames[i],
                exerciseType: "weight",
                record: post.exercises.weight[i],
                userId: user._id
            });
            await newpr.save();
        }
    }
    //update pr 
    const personalrecords = await PersonalRecord.find({userId:user._id}).catch(err => {
        console.error('Error:', err);
    });
    for (let i = 0; i < personalrecords.length; i++) {
        for (let j = 0; j < post.exercises.exerciseName.length; j++) {
            if(personalrecords[i].exerciseName === post.exercises.exerciseName[j]){
                if(personalrecords[i].record<post.exercises.weight[j]){
                    try{ 
                            await PersonalRecord.findOneAndUpdate({
                            _id: personalrecords[i]._id,
                            exerciseName: personalrecords[i].exerciseName
                        }, {
                            record: post.exercises.weight[j]
                        });
                        console.log("Successfully updated pr");
                    }  
                    catch (err){
                        console.log('Failed to update personal records');
                        console.log(err);
                        res.status(400).json('Failed to update personal records');
                    }
                }
            }
        }
    }

    // Update individual goals
    const indGoals = await Goal.find({ userId: user._id }).catch(err => {
        console.error('Error:', err);
    });

    for (let i = 0; i < indGoals.length; i++) {
        for (let j = 0; j < post.exercises.exerciseName.length; j++) {
            if (indGoals[i].exercise.name === post.exercises.exerciseName[j]) {
                if (indGoals[i].type === 'PR') {
                    const amount = post.exercises.weight[j];
                    if (indGoals[i].progress < amount) {
                        try {
                            await Goal.updateOne({ _id: indGoals[i]._id }, { $set: { progress: amount } });
                            console.log('Updated PR Goal');
                        }
                        catch (error) {
                            console.log('Failed to update PR goal');
                            console.log(error);
                            return res.status(400).json('Failed to update PR goal');
                        }

                    }
                }
                else if (indGoals[i].type === 'CST') {
                    const amount = post.exercises.reps[j] * post.exercises.sets[j];
                    try {
                        await Goal.updateOne({ _id: indGoals[i]._id }, { $set: { progress: indGoals[i].progress + amount } });
                        console.log('Updated CST Goal');
                    } catch (error) {
                        console.log('Failed to update CST Goal');
                        console.log(error);
                        return res.status(400).json('Failed to update CST goal');
                    }
                }
            }
        }
    }
    res.status(200).send("Completed.");

    //Update team goal
    const teamIds = user.teams;
    for (let i = 0; i < teamIds.length; i++) {
        for (let j = 0; j < post.exercises.exerciseName.length; j++) {
            const teamGoals = await TeamGoal.find({
                teamId: teamIds[i],
                'exercise.name': post.exercises.exerciseName[j]
            });

            for (let k = 0; k < teamGoals.length; k++) {
                if (teamGoals[k].type === 'CST') {
                    const amount = post.exercises.reps[j] * post.exercises.sets[j];
                    try {
                        await TeamGoal.updateOne(
                            { _id: teamGoals[k]._id },
                            { $set: { progress: teamGoals[k].progress + amount } }
                        );
                        console.log('Updated CST Goal');
                    } catch (error) {
                        console.log('Failed to update CST Goal');
                        console.log(error);
                        return res.status(400).json('Failed to update CST goal');
                    }
                }
            }

        }
    }

});

/**
   * Add a user's team post. Then, update the user's personal records, individual goals, and team goals if applicable.
   *
   * @name  addteampost/:teamid
   * @route   {POST} routes/postRoute/addteampost/:teamid
   * @routeparam {request} req - contains fields (params, body, cookies) to access the user's team and request details.
   */
router.post('/addteampost/:teamid', async (req, res) => {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.TokenSecret);
    var userId = decoded.id;
    const post = new PostTeam({
        userId: userId,
        teamId: req.params.teamid,
        title: req.body.title,
        note: req.body.note
    });
    try {
        const savePost = await post.save();
        console.log('Successfully posted');
        res.status(200).send('Successfully posted');
    } catch (err) {
        console.log('Failed to post');
        res.status(400).send(err);
    }
});

/**
   * Edit a user's post.
   *
   * @name  editpost/:postid
   * @route   {POST} routes/postRoute/editpost/:postid
   * @routeparam {request} req - contains fields (params, body, cookies) to access the user's specific post and request details.
   */
router.post('/editpost/:postid', async (req, res) => {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.TokenSecret);
    var userId = decoded.id;
    Post.findOneAndUpdate({
        _id: req.params.postid
    }, {
        $set: {
            userId: userId,
            title: req.body.title,
            exercises: req.body.exercises,
            description: req.body.description
        }
    }, function (err) {
        if (!err) {
            res.status(200).send('Edited post.');
            console.log('Edited Post');
        }
        else {
            res.status(400).send('Error occured.');
        }
    });
});

/**
   * Edit a user's team post.
   *
   * @name  editteampost/:postid
   * @route   {POST} routes/postRoute/editteampost/:postid
   * @routeparam {request} req - contains fields (params, body, cookies) to access the user's specific team post and request details.
   */
router.post('/editteampost/:postid', async (req, res) => {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.TokenSecret);
    var userId = decoded.id;
    PostTeam.findOneAndUpdate({
        _id: req.params.postid
    }, {
        $set: {
            title: req.body.title,
            note: req.body.note
        }
    }, function (err) {
        if (!err) {
            res.status(200).send('Edited post.');
            console.log('Edited Post');
        }
        else {
            res.status(400).send('Error occured.');
        }
    });
});

/**
   * Delete a user's post.
   *
   * @name  deletepost/:postid
   * @route   {DELETE} routes/postRoute/deletepost/:postid
   * @routeparam {request} req - contains 'params' to access the user's target post.
   */
router.delete('/deletepost/:postid', async (req, res) => {
    Post.findOneAndRemove({
        _id: req.params.postid
    }, function (err) {
        if (!err) {
            res.status(200).send('Deleted post.');
            console.log('Deleted Post');
        }
        else {
            res.status(400).send('Error occured.');
        }
    });
});

/**
   * Delete a user's team post.
   *
   * @name  deleteteampost/:postid
   * @route   {DELETE} routes/postRoute/deleteteampost/:postid
   * @routeparam {request} req - contains 'params' to access the user's target team post.
   */
router.delete('/deleteteampost/:postid', async (req, res) => {
    PostTeam.findOneAndRemove({
        _id: req.params.postid
    }, function (err) {
        if (!err) {
            res.status(200).send('Deleted team post.');
            console.log('Deleted team post');
        }
        else {
            res.status(400).send('Error occured.');
        }
    });
});

/**
   * Return's posts from the user's following list.
   *
   * @name  /posts
   * @route   {GET} routes/postRoute/posts
   * @routeparam {request} req - contains field 'cookies' to access the user's token.
   */
router.get('/posts', async (req, res) => {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.TokenSecret);
    var userId = decoded.id;
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(400).send('User was not found.');
    var following = user.following;
    following.push(user._id);
    const post = await Post.find({ userId: { $in: user.following } }).catch(err => {
        console.error('Error:', err);
    });
    var posts = [];
    for (let i = 0; i < post.length; i++) {
        const userid = post[i].userId;
        const user = await User.findOne({ _id: userid });
        if (!user) return res.status(400).send('User was not found.');
        var name = user.firstName + ' ' + user.lastName;
        var title = post[i].title;
        var exercises = post[i].exercises;
        var description = post[i].description;
        var date = (post[i].updatedAt.getMonth() + 1) + '/' + post[i].updatedAt.getDate() + '/' + post[i].updatedAt.getFullYear();
        var time = (post[i].updatedAt.getHours() + ':' + post[i].updatedAt.getMinutes() + ':' + post[i].updatedAt.getSeconds());
        posts.push({ name: name, title: title, exercises: exercises, description: description, date: date, time: time, userId: userid });
    }
    console.log(posts);
    return res.status(200).json(posts);
});

/**
   * Return's team updates from the user's selected team.
   *
   * @name  /teamposts/:tid
   * @route   {GET} routes/postRoute/teamposts/:tid
   * @routeparam {request} req - contains field 'params' to access the user's selected team ID and team updates.
   */
router.get('/teamposts/:tid', async (req, res) => {
    const team = await Team.findOne({ _id: req.params.tid });
    if (!team) return res.status(400).send('Team was not found.');
    const teamposts = await PostTeam.find({ userId: { $in: team.teamMembers } }).catch(err => {
        console.error('Error:', err);
    });
    var posts = [];
    for (let i = 0; i < teamposts.length; i++) {
        const userid = teamposts[i].userId;
        const user = await User.findOne({ _id: userid });
        if (!user) return res.status(400).send('User was not found.');
        var name = user.firstName + ' ' + user.lastName;
        var title = teamposts[i].title;
        var note = teamposts[i].note;
        var date = (teamposts[i].updatedAt.getMonth() + 1) + '/' + teamposts[i].updatedAt.getDate() + '/' + teamposts[i].updatedAt.getFullYear();
        var time = (teamposts[i].updatedAt.getHours() + ':' + teamposts[i].updatedAt.getMinutes() + ':' + teamposts[i].updatedAt.getSeconds());
        posts.push({ name: name, title: title, note: note, date: date, time: time });
    }
    console.log(posts);
    return res.status(200).json(posts);
});

/**
   * Return's team posts from the user's selected team.
   *
   * @name  /teampostsfeed/:tid
   * @route   {GET} routes/postRoute/teampostsfeed/:tid
   * @routeparam {request} req - contains field 'params' to access the user's selected team ID and posts from the users.
   */
router.get('/teampostsfeed/:tid', async (req, res) => {
    const team = await Team.findOne({ _id: req.params.tid });
    if (!team) return res.status(400).send('Team was not found.');
    const teamposts = await Post.find({ userId: { $in: team.teamMembers } }).catch(err => {
        console.error('Error:', err);
    });
    var posts = [];
    for (let i = 0; i < teamposts.length; i++) {
        const userid = teamposts[i].userId;
        const user = await User.findOne({ _id: userid });
        if (!user) return res.status(400).send('User was not found.');
        var name = user.firstName + ' ' + user.lastName;
        var title = teamposts[i].title;
        var exercises = teamposts[i].exercises;
        var description = teamposts[i].description;
        var date = (teamposts[i].updatedAt.getMonth() + 1) + '/' + teamposts[i].updatedAt.getDate() + '/' + teamposts[i].updatedAt.getFullYear();
        var time = (teamposts[i].updatedAt.getHours() + ':' + teamposts[i].updatedAt.getMinutes() + ':' + teamposts[i].updatedAt.getSeconds());
        posts.push({ name: name, title: title, exercises: exercises, description: description, date: date, time: time });
    }
    console.log(posts);
    return res.status(200).json(posts);

});

module.exports = router;