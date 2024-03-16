const router = require('express').Router();
const ObjectId = require('mongodb').ObjectId;
const { authenticateToken } = require('../middleware/auth');
const TeamGoal = require('../models/TeamGoal');
const Team = require('../models/Team');

/**
   * Create new team goal.
   *
   * @name  CreateTeamGoal
   * @route   {POST} routes/teamGoalRoute/
   * @routeparam {authenticateToken} authenticateToken - contains an access token for the user account.
   * @routeparam {request} req - contains field 'body' to access the details of the new goal.
   */
router.post('/', authenticateToken, async (req, res) => {
    const team = await Team.findById(req.body.teamId);

    const goal = new TeamGoal({
        teamId: req.body.teamId,
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        exercise: req.body.exercise,
        progress: req.progress,
        endDate: req.body.endDate ? new Date(req.body.endDate) : null
    });

    try {
        await goal.save();
        console.log('Successfully created TeamGoal.');
        res.status(200).send('Successfully created TeamGoal.')
    } catch (err) {
        console.log('Failed to create TeamGoal.');
        res.status(400).send(err);
    }
});

/**
   * Return team goals.
   *
   * @name  ReturnTeamGoals
   * @route   {GET} routes/teamGoalRoute/:tid
   * @routeparam {authenticateToken} authenticateToken - contains an access token for the user account.
   * @routeparam {request} req - contains field 'params' to access the team id and get the team info.
   */
router.get('/:tid', authenticateToken, async (req, res) => {
    const team = await Team.findById(req.params.tid);

    try {
        const goals = await TeamGoal.find({ teamId: req.params.tid });
        console.log('Successfully found Goals.');
        res.status(200).json(goals);
    } catch (err) {
        console.log('Failed to find Goals.');
        res.status(400).json({message: err});
    }
});

/**
   * Edit a team goal.
   *
   * @name  EditTeamGoal
   * @route   {PUT} routes/teamGoalRoute/:gid
   * @routeparam {authenticateToken} authenticateToken - contains an access token for the user account.
   * @routeparam {request} req - contains fields (params, body) to access the team id, goal id, and get the details of the request.
   */
router.put('/:gid', authenticateToken, async (req, res) => {
    const team = await Team.findById(req.body.teamId);

    const filter = {
        _id: req.params.gid,
        teamId: req.body.teamId
    };

    const update = {
        ...(req.body.title && { title: req.body.title }),
        ...(req.body.description && { description: req.body.description }),
        ...(req.body.type && { type: req.body.type }),
        ...(req.body.exercise.name && { 'exercise.name': req.body.exercise.name }),
        ...(req.body.exercise.amount && { 'exercise.amount': req.body.exercise.amount }),
        ...(req.body.progress && { progress: req.body.progress }),
        ...(req.body.endDate && { endDate: new Date(req.body.endDate) })
    };

    try {
        await TeamGoal.updateOne(filter, update);
        console.log('Successfully updated Goal.');
        res.status(200).json('Successfully updated Goal.');
    } catch (err) {
        console.log('Failed to update Goal.');
        res.status(400).send(err);
    }
});

/**
   * Delete a team goal.
   *
   * @name  DeleteTeamGoal
   * @route   {DELETE} routes/teamGoalRoute/:gid
   * @routeparam {authenticateToken} authenticateToken - contains an access token for the user account.
   * @routeparam {request} req - contains fields (body, params) to access the team id and goal id.
   */
router.delete('/:gid', authenticateToken, async (req, res) => {
    const team = await Team.findById(req.body.teamId);

    const filter = {
        _id: req.params.gid,
        teamId: req.body.teamId
    };

    try {
        await TeamGoal.deleteOne(filter);
        console.log('Successfully deleted TeamGoal.');
        res.status(200).json('Successfully deleted TeamGoal.');
    } catch (err) {
        console.log('Failed to delete Goal.');
        res.status(400).send('Failed to delete TeamGoal.');
    }
});

module.exports = router;