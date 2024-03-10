const router = require('express').Router();
const { authenticateToken } = require('../middleware/auth');
const { Goal } = require('../models/Goal');

const allowedFields = ['title, description, ']

router.post('/', authenticateToken, async (req, res) => {
    const goal = new Goal({
        userId: req.user._id,
        title: req.body.title ? req.body.title : null,
        description: req.body.description ? req.body.title : null,
        type: req.body.type,
        exercise: {
            name: req.body.exercise.name,
            amount: req.body.exercise.amount ? req.body.exercise.amount : null,
            difficulty: req.body.exercise.difficulty ? req.body.exercise.difficulty : null
        },
        progress: 0,
        createDate: new Date(),
        endDate: req.body.endDate ? new Date(req.body.endDate) : null
    });

    try {
        await goal.save();
        console.log('Successfully created Goal.');
        res.status(200).send('Successfully created Goal.')
    } catch (err) {
        console.log('Failed to create Goal.');
        res.status(400).send(err);
    }
});

router.get('/', authenticateToken, async (req, res) => {
    try {
        const goals = await Goal.find({ userId: req.user._id });
        console.log('Successfully found Goals.');
        res.status(200).send(goals);
    } catch (err) {
        console.log('Failed to find Goals.');
        res.status(400).send(err);
    }
});

router.put('/:gid', authenticateToken, async (req, res) => {
    const filter = {
        _id: req.params.gid,
        userId: req.user._id
    };

    const update = {
        ...(req.body.title && { title: req.body.title }),
        ...(req.body.description && { description: req.body.description }),
        ...(req.body.type && { type: req.body.type }),
        ...(req.body.exercise.name && { 'exercise.name': req.body.exercise.name}),
        ...(req.body.exercise.amount && { 'exercise.amount': req.body.exercise.amount }),
        ...(req.body.exercise.difficulty && { 'exercise.difficulty': req.body.exercise.difficulty }),
        ...(req.body.progress && { progress: req.body.progress }),
        ...(req.body.endDate && { endDate: new Date(req.body.endDate) })
    };

    try {
        await Goal.findOneAndUpdate(filter, update);
        console.log('Successfully updated Goal.');
        res.status(200).send('Successfully updated Goal.');
    } catch (err) {
        console.log('Failed to update Goal.');
        res.status(400).send(err);
    }
});

router.delete('/:gid', authenticateToken, async (req, res) => {
    const filter = {
        _id: req.params.gid,
        userId: req.user._id
    };

    const update = {
        ...req.body
    };

    try {
        await Goal.findOneAndDelete(filter, update);
        console.log('Successfully deleted Goal.');
        res.status(200).send('Successfully deleted Goal.');
    } catch (err) {
        console.log('Failed to delete Goal.');
        res.status(400).send('Failed to delete Goal.');
    }
});

module.exports = router;