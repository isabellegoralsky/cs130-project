const express = require('express');
const router = require('express').Router();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Team = require('../models/Team');
const Template = require('../models/Template');

const maxAge = 30 * 24 * 60 * 60;
const createToken = (id) => {
   return jwt.sign({
       id
   }, process.env.TokenSecret, {
       expiresIn: maxAge
   });
}

router.post('/addtemplate', async (req, res) => {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.TokenSecret);
    var userId = decoded.id;
    const templateExists = await Template.findOne({
        userId: userId
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
        const templates = templateExists.workoutName;
        if(templates.includes(req.body.workoutName)){
            return res.status(400).send("Already have this template.");
        }
    }
    Template.findOneAndUpdate({
        userId: userId
    }, {
        $push: {
            workoutName: req.body.workoutName,
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
    var index = templateExists.workoutName.indexOf(req.body.workoutName);
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
        workoutName: templateExists.workoutName,
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

router.post('/deletetemplate', async (req, res) => {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.TokenSecret);
    var userId = decoded.id;
    const templateExists = await Template.findOne({
        userId: userId
    });
    if (templateExists === null){
        return res.status(400).send("Template does not exist.");
    }
    var index = templateExists.workoutName.indexOf(req.body.workoutName);
    if(index===-1){
        return res.status(400).send("Workout does not exist.");
    }
    var workoutName = templateExists.workoutName;
    var exercises = templateExists.exercises;
    var note = templateExists.note;
    workoutName.splice(index, 1);
    exercises.splice(index, 1);
    note.splice(index, 1);
    Template.replaceOne({
        userId: userId
    }, {
        userId: userId,
        workoutName: workoutName,
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

module.exports = router;