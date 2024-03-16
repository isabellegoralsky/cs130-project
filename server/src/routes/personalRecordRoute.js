const express = require('express');
const router = require('express').Router();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const PersonalRecord = require('../models/PersonalRecord');

/**
   * Create and save a personal record to a user's account.
   *
   * @name  /
   * @route   {POST} routes/personalRecordRoute/
   * @routeparam {request} req - contains fields (user, body, cookies) to access the user requesting and the request details.
   */
router.post('/', async (req, res) => {
    const token = req.cookies.jwt;
    if (!token) return res.status(400).send('Cookie was not found.')
    const decoded = jwt.verify(token, process.env.TokenSecret);
    var userId = decoded.id;
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(400).send('User was not found.');

    const personalRecord = new PersonalRecord({
        exerciseName: req.body.exerciseName,
        exerciseType: req.body.exerciseType,
        record: req.body.record,
        userId: userId
    });
    try {
        await personalRecord.save();
        console.log('Successfully added PersonalRecord.');
        res.status(200).send('Successfully added PersonalRecord.');
    } catch (err) {
        console.log('Failed to add PersonalRecord.');
        res.status(400).send(err);
    }
});

/**
   * Returns a user's personal records.
   *
   * @name  /
   * @route   {GET} routes/personalRecordRoute/
   * @routeparam {request} req - contains fields 'cookies' to access the user requesting.
   */
router.get('/', async (req, res) => {
    const token = req.cookies.jwt;
    if (!token) return res.status(400).send('Cookie was not found.')
    const decoded = jwt.verify(token, process.env.TokenSecret);
    var userId = decoded.id;
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(400).send('User was not found.');

    try {
        const personalRecords = await PersonalRecord.find({ userId: userId });
        console.log('Successfully found PersonalRecords.');
        res.status(200).send(personalRecords);
    } catch (err) {
        console.log('Failed to find PersonalRecords.');
        res.status(400).send(err);
    }
});

/**
   * Edit a user's personal record.
   *
   * @name  /:id
   * @route   {PUT} routes/personalRecordRoute/:id
   * @routeparam {request} req - contains fields (user, body, cookies, params) to access the user requesting and the request details.
   */
router.put('/:id', async (req, res) => {
    const token = req.cookies.jwt;
    if (!token) return res.status(400).send('Cookie was not found.')
    const decoded = jwt.verify(token, process.env.TokenSecret);
    var userId = decoded.id;
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(400).send('User was not found.');

    const personalRecordId = req.params.id;
    const personalRecord = await PersonalRecord.findById(personalRecordId);
    if (!personalRecord) return res.status(400).send('PersonalRecord was not found.');
    if (personalRecord.userId != userId) return res.status(400).send('User does not own PersonalRecord.');

    const update = {
        ...(req.body.exerciseName && { exerciseName: req.body.exerciseName }),
        ...(req.body.exerciseType && { exerciseType: req.body.exerciseType }),
        ...(req.body.record && { record: req.body.record })
    }

    try {
        await PersonalRecord.findByIdAndUpdate(personalRecordId, update);
        console.log('Successfully updated PersonalRecord.');
        res.status(200).send('Successfully updated PersonalRecord.');
    } catch (err) {
        console.log('Failed to update PersonalRecord.');
        res.status(400).send('Failed to update PersonalRecord.');
    }
});

/**
   * Delete a user's personal record.
   *
   * @name  /:id
   * @route   {DELETE} routes/personalRecordRoute/:id
   * @routeparam {request} req - contains fields (params, cookies) to access the user requesting and the request details.
   */
router.delete('/:id', async (req, res) => {
    const token = req.cookies.jwt;
    if (!token) return res.status(400).send('Cookie was not found.')
    const decoded = jwt.verify(token, process.env.TokenSecret);
    var userId = decoded.id;
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(400).send('User was not found.');

    const personalRecordId = req.params.id;
    const personalRecord = await PersonalRecord.findById(personalRecordId);
    if (!personalRecord) return res.status(400).send('PersonalRecord was not found.');
    if (personalRecord.userId != userId) return res.status(400).send('User does not own PersonalRecord.');

    try {
        await personalRecord.deleteOne();
        console.log('Successfully deleted PersonalRecord.');
        res.status(200).send('Successfully deleted PersonalRecord.');
    } catch (err) {
        console.log('Failed to delete PersonalRecord.');
        res.status(400).send(err);
    }
});

module.exports = router;