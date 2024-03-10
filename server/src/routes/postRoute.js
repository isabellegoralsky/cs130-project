const express = require('express');
const router = require('express').Router();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Team = require('../models/Team');
const Post = require('../models/Post');
const PostTeam = require('../models/PostTeam');

router.post('/addpost', async (req, res) => {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.TokenSecret);
    var userId = decoded.id;
    const post = new Post({
        userId: userId,
        title: req.body.title,
        exercises: req.body.exercises,
        description: req.body.description
    });
    try {
        const savePost= await post.save();
        console.log("Successfully posted");
    } catch (err) {
        console.log("Failed to post");
        res.status(400).send(err);
    }
    console.log("here");
});

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
        const savePost= await post.save();
        console.log("Successfully posted");
        res.status(200).send("Successfully posted");
    } catch (err) {
        console.log("Failed to post");
        res.status(400).send(err);
    }
});

router.post('/editpost/:postid', async (req, res) => {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.TokenSecret);
    var userId = decoded.id;
    Post.findOneAndUpdate({
        _id: req.params.postid
    },{
        $set: {
            userId: userId,
            title: req.body.title,
            exercises: req.body.exercises,
            description: req.body.description
        }
    }, function (err){
        if (!err){
            res.status(200).send('Edited post.');
            console.log("Edited Post");
        }
        else{
            res.status(400).send('Error occured.');
        }
    });
});

router.post('/editteampost/:postid', async (req, res) => {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.TokenSecret);
    var userId = decoded.id;
    PostTeam.findOneAndUpdate({
        _id: req.params.postid
    },{
        $set: {
            title: req.body.title,
            note: req.body.note
        }
    }, function (err){
        if (!err){
            res.status(200).send('Edited post.');
            console.log("Edited Post");
        }
        else{
            res.status(400).send('Error occured.');
        }
    });
});

router.delete('/deletepost/:postid', async (req, res) => {
    Post.findOneAndRemove({
        _id: req.params.postid
    }, function (err) {
        if (!err){
            res.status(200).send('Deleted post.');
            console.log("Deleted Post");
        }
        else{
            res.status(400).send('Error occured.');
        }
    });
});

router.delete('/deleteteampost/:postid', async (req, res) => {
    PostTeam.findOneAndRemove({
        _id: req.params.postid
    }, function (err) {
        if (!err){
            res.status(200).send('Deleted team post.');
            console.log("Deleted team post");
        }
        else{
            res.status(400).send('Error occured.');
        }
    });
});

module.exports = router;