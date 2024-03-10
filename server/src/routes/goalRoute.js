const router = require('express').Router();
const { authenticateToken } = require('../middleware/auth');
const Goal = require('../models/Goal');

router.post('/', authenticateToken, async (req, res) => {
    const user = req.user;

    const goal = new Goal({
        userId: user._id,
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        exercise: req.body.exercise,
        progress: req.body.progress,
        endDate: req.body.endDate ? new Date(req.body.endDate) : null
    });

    try {
        await goal.save();
        console.log('Successfully created Goal');
        res.status(200).send('Successfully created Goal')
    } catch (error) {
        console.log('Failed to create Goal');
        console.log(error);
        res.status(400).send('Failed to create Goal');
    }
});

router.get('/', authenticateToken, async (req, res) => {
    const user = req.user;

    try {
        const goals = await Goal.find({ userId: user._id });
        console.log('Successfully found Goals');
        res.status(200).send(goals);
    } catch (error) {
        console.log('Failed to find Goals');
        console.log(error);
        res.status(400).send('Failed to find Goals');
    }
});

router.put('/:gid', authenticateToken, async (req, res) => {
    const user = req.user;

    const filter = {
        _id: req.params.gid,
        userId: user._id
    };

    const update = {
        ...(req.body.title && { title: req.body.title }),
        ...(req.body.description && { description: req.body.description }),
        ...(req.body.type && { type: req.body.type }),
        ...(req.body.exercise.name && { 'exercise.name': req.body.exercise.name}),
        ...(req.body.exercise.amount && { 'exercise.amount': req.body.exercise.amount }),
        ...(req.body.progress && { progress: req.body.progress }),
        ...(req.body.endDate && { endDate: new Date(req.body.endDate) })
    };

    try {
        await Goal.updateOne(filter, update);
        console.log('Successfully updated Goal');
        res.status(200).send('Successfully updated Goal');
    } catch (error) {
        console.log('Failed to update Goal');
        console.log(error);
        res.status(400).send('Failed to update Goal');
    }
});

router.delete('/:gid', authenticateToken, async (req, res) => {
    const user = req.user;

    const filter = {
        _id: req.params.gid,
        userId: user._id
    };

    try {
        await Goal.deleteOne(filter);
        console.log('Successfully deleted Goal');
        res.status(200).send('Successfully deleted Goal');
    } catch (error) {
        console.log('Failed to delete Goal');
        console.log(error);
        res.status(400).send('Failed to delete Goal');
    }
});

module.exports = router;