
const express = require('express');
const router = require('express').Router();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
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

/**
   * Add template to user pinned post (template) on profile.
   *
   * @name  AddPinnedWorkout
   * @route   {POST} routes/profileRoute/addtemplate
   * @routeparam {request} req - contains fields (cookies, body) to access the user's auth token and templates.
   */
router.post('/addtemplate', async (req, res) => {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.TokenSecret);
    var userId = decoded.id;
    const templateExists = await Template.findOne({
        userId: userId
    });
    res.set({
        "Content-Type": "application/json",
    });

    if (templateExists === null){
        const template = new Template({
            userId: userId
        });
        try {
            const saveTemplate = await template.save();
            console.log("Successfully created template.");
        } catch (err) {
            console.log("Failed to create template.");
            return res.status(400).send(err);
        }
    }
    else {
        const templates = templateExists.templateName;
        if(templates.includes(req.body.workoutName)){
            return res.status(400).send("Already have this template.");
        }
    }
    var note = req.body.note;
    if(note===undefined){
        note="nullstring";
    }
    Template.findOneAndUpdate({
        userId: userId
    }, {
        $push: {
            templateName: req.body.workoutName,
            exercises: req.body.exercises,
            note: req.body.note
        }
    }, {
        new: true
    }, (err, doc) => {
        if (err) {
            console.log("Something went wrong");
            console.log(err);
        }
        else{
            console.log("Added to template");
        }
        res.status(200).send("Successfully added to template.");
    });
});

/**
   * Edit pinned post (template) on user profile.
   *
   * @name  EditPinnedWorkout
   * @route   {POST} routes/profileRoute/edittemplate
   * @routeparam {request} req - contains fields (cookies, body) to access the user's auth token and requested template.
   */
router.post('/edittemplate', async (req, res) => {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.TokenSecret);
    var userId = decoded.id;
    const templateExists = await Template.findOne({
        userId: userId
    });
    if (templateExists === null){
        return res.status(400).send("Template does not exist.");
    }
    var index = templateExists.templateName.indexOf(req.body.workoutName);
    if(index===-1){
        return res.status(400).send("Workout does not exist.");
    }
    if(req.body.exercises != undefined){
        templateExists.exercises[index] = req.body.exercises;
    }
    if(req.body.note != undefined){
        templateExists.note[index] = req.body.note;
    }
    Template.replaceOne({
        userId: userId
    }, {
        userId: userId,
        templateName: templateExists.templateName,
        exercises: templateExists.exercises,
        note: templateExists.note
    }, {
        new: true
    }, (err, doc) => {
        if (err) {
            console.log("Something went wrong");
            console.log(err);
        }
        else{
            console.log("Edited a template");
        }
        res.status(200).send("Successfully edited a template.");
    });
});

/**
   * Delete pinned post (template) on user profile.
   *
   * @name  DeletePinnedWorkout
   * @route   {POST} routes/profileRoute/deletetemplate
   * @routeparam {request} req - contains fields (cookies, body) to access the user's auth token and desired template.
   */
router.post('/deletetemplate', async (req, res) => {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.TokenSecret);
    var userId = decoded.id;
    const templateExists = await Template.findOne({
        userId: userId
    });
    if (templateExists === null){
        console.log("null")
        return res.status(400).send("Template does not exist.");
    }
    var index = templateExists.templateName.indexOf(req.body.workoutName);
    if(index===-1){
        console.log("userId", userId)
        return res.status(400).send("Workout does not exist.");
    }
    var workoutName = templateExists.templateName;
    var exercises = templateExists.exercises;
    var note = templateExists.note;
    workoutName.splice(index, 1);
    exercises.splice(index, 1);
    note.splice(index, 1);
    Template.replaceOne({
        userId: userId
    }, {
        userId: userId,
        templateName: workoutName,
        exercises: exercises,
        note: note
    }, {
        new: true
    }, (err, doc) => {
        if (err) {
            console.log("Something went wrong");
            console.log(err);
        }
        else{
            console.log("Deleted a template");
        }
        res.status(200).send("Successfully deleted a template.");
    });
});

/**
   * Return user template
   *
   * @name  GetPinnedWorkout
   * @route   {GET} routes/profileRoute/template/:uid
   * @routeparam {request} req - contains field 'params' to get user id and access the user's templates.
   */
router.get('/template/:uid', async (req, res) => {
    console.log("uid is")
    console.log(req.params.uid)
    const templateExists = await Template.findOne({
        userId: req.params.uid
    });
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });
    if (templateExists === null){
        console.log("null")
        return res.status(400).json("Template does not exist.");
    }
    else{
        console.log("exists")
        console.log(templateExists);

        return res.json(templateExists);
    }
});

/**
   * Return user profile page
   *
   * @name  GetUserProfile
   * @route   {GET} routes/profileRoute/:uid/profilepage
   * @routeparam {request} req - contains field 'params' to get user id and access the user's information such as following, profile pic, etc.
   */
router.get('/:uid/profilepage', async (req, res) => {
    const user = await User.findOne({ _id: req.params.uid });
    if (!user) return res.status(400).json('User was not found.');
    var name = user.firstName + " " + user.lastName;
    const profilePic = await Picture.findOne({ _id: user.profilePicture});
    const followingids = user.following;
    var followingNames = [];
    for(let i=0; i<followingids.length; i++){
        const found = await User.findOne({_id: followingids[i]});
        var fullName = found.firstName + ' ' + found.lastName;
        followingNames.push(fullName);
    }
    const template = await Template.findOne({
        userId: req.params.uid
    });
    var personalRecords = await PersonalRecord.find({userId: user._id});
    var posts = await Post.find({userId: user._id});
    console.log(posts);
    var profilepage = {name, profilePic, followingids, followingNames, template, personalRecords, posts};
    return res.status(200).json(profilepage);
});

module.exports = router;