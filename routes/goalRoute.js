const express = require('express');
const router = require('express').Router();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { TargetGoal, ConsistencyGoal } = require('../models/Goal');
const Post = require('../models/Post')

async function getUserFromCookie(req){
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.TokenSecret);
    var userId = decoded.id;
    const user = await User.findOne({
        _id: userId
    });
    return user
}
function validateConsistencyGoal(){
    return true;
}
function validateTargetGoal(){
    return true;
}

router.post("/addConsistencyGoal", async (req, res) => {
    const user = await getUserFromCookie(req);
    if (!user) return res.status(400).send('User is not found.');
    const goal = new ConsistencyGoal({
        email: user.email,
        startDate: new Date(),
        ...req.body
    });
    try {
        const saveGoal = await goal.save();
        console.log("Successfully created consistency goal");
        res.status(200).send("Successfully created consistency goal")
    } catch (err) {
        console.log("Failed to create goal");
        res.status(400).send(err);
    }

});

router.post("/addTargetGoal", async (req, res) => {
    const user = await getUserFromCookie(req);
    if (!user) return res.status(400).send('User is not found.');
    const goal = new ConsistencyGoal({
        email: user.email,
        startDate: new Date(),
        ...req.body
    });
    try {
        const saveGoal = await goal.save();
        console.log("Successfully created consistency goal");
        res.status(200).send("Successfully created consistency goal")
    } catch (err) {
        console.log("Failed to create goal");
        res.status(400).send(err);
    }

});

router.post("/deleteConsistencyGoal", async (req, res) => {

});

router.post("/deleteTargetGoal", async (req, res) => {

});



router.get("/getTargetGoals", async (req, res) => {
    const user = await getUserFromCookie(req);
    if (!user) return res.status(400).send('User is not found.');
    const targetGoals = TargetGoal.find({
        email: user.email
    });
});

router.get("/getConsistencyGoals", async (req, res) => {
    const user = await getUserFromCookie(req);
    if (!user) return res.status(400).send('User is not found.');
    const consistencyGoals = await ConsistencyGoal.find({
        email: user.email
    });
    // consistencyGoals.map(goal => {
    //     if(goal.per == 'DAY'){
    //         Post.find({
    //             date: 
    //         })
    //     } else if()

    //     return {
    //         ...goal,
    //         progress:
    //     }
    // })
})