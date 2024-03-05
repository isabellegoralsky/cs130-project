const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { PRGoal, ConsistencyGoal } = require('../models/Goal');
// const Post = require('../models/Post')

function getUserIdFromCookie(req){
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.TokenSecret);
    return decoded.id;
}

router.post("/addConsistencyGoal", async (req, res) => {
    const user_id = await getUserIdFromCookie(req);
    if(!user_id){
        res.status(400).json({error: "No user info"});
        return;
    }
    const goal = new ConsistencyGoal({
        user_id,
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

router.post("/addPRGoal", async (req, res) => {
    const user_id = getUserIdFromCookie(req);
    if(!user_id){
        res.status(400).json({error: "No user info"});
        return;
    }
    const goal = new PRGoal({
        user_id,
        startDate: new Date(),
        ...req.body
    });
    try {
        const saveGoal = await goal.save();
        console.log("Successfully created PR goal");
        res.status(200).send("Successfully created PR goal")
    } catch (err) {
        console.log("Failed to create goal");
        res.status(400).send(err);
    }
});

router.post("/deleteConsistencyGoal", async (req, res) => {
    try {
        await ConsistencyGoal.findByIdAndDelete(req.body.id)
        console.log("Successfully deleted consistency goal");
        res.status(200).send("Successfully deleted consistency goal")
    } catch (err) {
        console.log("Failed to delete goal");
        res.status(400).send(err);
    }
});

router.post("/deletePRGoal", async (req, res) => {
    try {
        await PRGoal.findByIdAndDelete(req.body.id)
        console.log("Successfully deleted PR goal");
        res.status(200).send("Successfully deleted PR goal")
    } catch (err) {
        console.log("Failed to delete goal");
        res.status(400).send(err);
    }
});

//returns all goals with progress for a user
router.get("/getPRGoals", async (req, res) => {
    const user_id = await getUserIdFromCookie(req);
    if(!user_id){
        res.status(400).json({error: "No user info"});
        return;
    }
    try {
        const prGoals = await PRGoal.find({ user_id });
        res.status(400).json({
            goals: prGoals
        });
    } catch (err) {
        res.status(200).json({ error: err })
    }
});

router.get("/getConsistencyGoals", async (req, res) => {
    const user_id = await getUserIdFromCookie(req);
    if(!user_id){
        res.status(400).json({error: "No user info"});
        return;
    }
    try {
        const consistencyGoals = await ConsistencyGoal.find({
            user_id
        });
        res.status(400).json({
            goals: consistencyGoals
        });
    } catch (err) {
        res.status(200).json({ error: err })
    }
})

module.exports = router;