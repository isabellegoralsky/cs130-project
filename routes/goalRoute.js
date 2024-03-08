const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { SamplePost, PRGoal, ConsistencyGoal } = require('../models/Goal');

router.post("/addConsistencyGoal", async (req, res) => {
    const token = req.cookies.jwt;
    if (!token) return res.status(400).send('Cookie was not found.')
    const user_id = jwt.verify(token, process.env.TokenSecret).id;
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
    const token = req.cookies.jwt;
    if (!token) return res.status(400).send('Cookie was not found.')
    const user_id = jwt.verify(token, process.env.TokenSecret).id;
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

router.get("/getPRGoals", async (req, res) => {
    const token = req.cookies.jwt;
    if (!token) return res.status(400).send('Cookie was not found.')
    const user_id = jwt.verify(token, process.env.TokenSecret).id;
    if(!user_id){
        res.status(400).json({error: "No user info"});
        return;
    }
    try {
        const prGoals = await PRGoal.find({ user_id });
        let goals = [];
        for(const goal of prGoals){
            const progress = await findProgressTowardsPRGoal(goal);
            goals.push({goal, progress})
        }
        res.status(400).json({ goals });
    } catch (err) {
        res.status(200).json({ error: err });
    }
});

router.get("/getConsistencyGoals", async (req, res) => {
    const token = req.cookies.jwt;
    if (!token) return res.status(400).send('Cookie was not found.')
    const user_id = jwt.verify(token, process.env.TokenSecret).id;
    if(!user_id){
        res.status(400).json({error: "No user info"});
        return;
    }
    try {
        const consistencyGoals = await ConsistencyGoal.find({ user_id });
        let goals = [];
        for(const goal of consistencyGoals){
            const progress = await findProgressTowardsConsistencyGoals(goal);
            goals.push({goal, progress})
        }
        res.status(400).json({ goals });
    } catch (err) {
        console.log(err);
        res.status(200).json({ error: err })
    }
})

module.exports = router;

async function findProgressTowardsPRGoal(prGoal) {
    try {
        const { user_id, exerciseType, exercise } = prGoal;
        const progress = await SamplePost.aggregate([
            {
                $match: {
                    user_id: user_id,
                    'exercises.exerciseType': exerciseType,
                    'exercises.exercise': exercise
                }
            },
            {
                $unwind: '$exercises'
            },
            {
                $match: {
                    'exercises.exerciseType': exerciseType,
                    'exercises.exercise': exercise
                }
            },
            {
                $group: {
                    _id: null,
                    maxAmount: { $max: { $toInt: '$exercises.amount' } }
                }
            }
        ]);

        if (progress.length > 0) {
            return progress[0].maxAmount;
        } else {
            return 0;
        }
    } catch (error) {
        console.error('Error finding progress:', error);
        throw error;
    }
}

async function findProgressTowardsConsistencyGoals(goal) {
    try {
        const { unit, user_id, exerciseType, exercise } = goal;
        
        let since;
        if(goal.per == "DAY"){ 
            since = getStartOfDay();
        } else if (goal.per == "WEEK") { 
            since = getStartOfWeek();
        } else if (goal.per == "MONTH") {
            since = getStartOfMonth();
        }
        
        let sumField;
        if(unit == 'SETS'){
            sumField = { $sum: { $toInt: '$exercises.sets' } };
        } else if(unit == 'REPS'){
            sumField = { $sum: { $toInt: '$exercises.reps' } };
        } else if(unit == 'DURATION_MINS'){
            sumField = { $sum: { $toInt: '$exercises.amount' } }; //assuming amount is DURATION_MINS
        } else { // COUNT
            sumField = { $count: {} } 
        }

        const result = await SamplePost.aggregate([
            {
                $match: {
                    user_id: user_id,
                    'exercises.exerciseType': exerciseType,
                    'exercises.exercise': exercise,
                    date: { $gt: since }
                }
            },
            {
                $unwind: '$exercises'
            },
            {
                $match: {
                    'exercises.exerciseType': exerciseType,
                    'exercises.exercise': exercise
                }
            },
            {
                $group: {
                    _id: null,
                    sumField
                }
            }
        ]);
        
        if(result.length > 0){
            return result[0].sumField;
        }
        return 0;
        
    } catch (error) {
        console.error('Error finding progress:', error);
        throw error;
    }

}

function getStartOfWeek(){
    const today = new Date();
    const start = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000);
    start.setHours(0,0,0,0);
    return start;
}
function getStartOfDay(){
    return (new Date()).setHours(0,0,0,0);
}
function getStartOfMonth(){
    const start = new Date()
    start.setDate(1);
    start.setHours(0,0,0,0);
    return start;
}
