import React, { useState, useEffect } from 'react';
import Goal from './Goal';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './GoalsPage.css'

const GoalsPage = () => {
    const [user, setUser] = useState({});
    const [goals, setGoals] = useState([]);
    const [exerciseName, setExerciseName] = useState('');
    const [goalTitle, setGoalTitle] = useState('');
    const [goalDesc, setGoalDesc] = useState('');
    const [goalType, setGoalType] = useState('');
    const [goalTarget, setGoalTarget] = useState('');
    const [goalUnit, setGoalUnit] = useState('');
    const [endMonth, setEndMonth] = useState('');
    const [endDay, setEndDay] = useState('');
    const [endYear, setEndYear] = useState('');

    const [openAddGoal, setOpenAddGoal] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate hook

    const exerciseList = [
        "Deadlift",
        "Squat",
        "Bench Press",
        "Pull-Up",
        "Push-Up",
        "Bent-Over Row",
        "Overhead Press",
        "Lunges",
        "Plank",
        "Leg Press",
        "Barbell Curl",
        "Tricep Dip",
        "Shoulder Press",
        "Lat Pull-Down",
        "Russian Twist",
        "Burpees"
    ];
    const handleOpenAddGoal = (e) => {
        setOpenAddGoal(true);
    }

    const handleAddGoal = async (e) => {
        e.preventDefault();
        const formdata = {
            userId: user._id,
            title: goalTitle,
            description: goalDesc,
            type: goalType,
            exercise: {
                name: exerciseName,
                amount: {
                    unit: goalUnit,     // LB/MPH for PR. SET/MIN for CST
                    value: goalTarget

                }
            },
            endDate: new Date(endYear, endMonth, endDay)
        };
        console.log(formdata);
        const registerUrl = 'http://localhost:3001/goal/';
        try {
            const response = await fetch(registerUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formdata),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data);
                setGoalTitle('');
                setGoalDesc('');
                setGoalType('');
                setExerciseName('');
                setGoalTarget('');
                setGoalUnit('');
                setEndDay('');
                setEndMonth('');
                setEndYear('');
                setOpenAddGoal(false);
                window.location.reload();
            } else {
                throw new Error(data || 'Failed to add goal');
            }
        } catch (error) {
            console.error('Add Goal Error:', error);
        }
    };

    useEffect(() => {
        //fetch user
        async function fetchUser() {
            try {
                const url = `http://localhost:3001/user`;
                const response = await fetch(url, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                const data = await response.json();
                setUser(data);
            }
            catch (error) {
                console.error('Error:', error);
            }
        }
        fetchUser();

    }, [])

    useEffect(() => {
        async function fetchGoals() {
            const userId = user._id;
            if (userId) {
                const url = `http://localhost:3001/goal/`;

                try {
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    console.log("goals");
                    setGoals(data);
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        }

        fetchGoals();
    }, [user]);


    return (
        <div className="goals-page">
            <h2 id="my-goals">MY GOALS</h2>
            <div id="goals-div">
                <div className="column">
                    <h2 class="goal-header">PERSONAL RECORD</h2>
                    {goals
                        .filter(goal => goal.type === 'PR') // Filter to include only goals with type === 'PR'
                        .map((goal, index) => (
                            <Goal
                                key={index}
                                gid={goal._id}
                                title={goal.title}
                                description={goal.description}
                                savedprogress={goal.progress}
                                goalvalue={goal.exercise.amount.value}
                                name={goal.exercise.name}
                                type={goal.type}
                                unit={goal.exercise.amount.unit}
                                date={goal.endsAt}
                            />
                        ))
                    }
                </div>
                <div className="column">
                    <h2 class="goal-header">CONSISTENCY</h2>
                    {goals
                        .filter(goal => goal.type === 'CST') // Filter to include only goals with type === 'PR'
                        .map((goal, index) => (
                            <Goal
                                key={index}
                                gid={goal._id}
                                title={goal.title}
                                description={goal.description}
                                savedprogress={goal.progress}
                                goalvalue={goal.exercise.amount.value}
                                name={goal.exercise.name}
                                type={goal.type}
                                unit={goal.exercise.amount.unit}
                                date={goal.endsAt}
                            />
                        ))
                    }
                </div>
            </div>
            <div>
                <div id="another-goal">
                    <span classname="ClickableText" onClick={handleOpenAddGoal}>add another goal?</span>
                </div>
                <Dialog.Root open={openAddGoal}>
                    <Dialog.Portal>
                        <Dialog.Overlay className="DialogOverlay" />
                        <Dialog.Content className="DialogContent">
                            <Dialog.Title className="DialogTitle">Add a Goal</Dialog.Title>
                            <div class="teams-goal-pop">
                                <input
                                    className="Input goal-teams-in goal-in"
                                    placeholder="Goal Title"
                                    value={goalTitle}
                                    onChange={(e) => setGoalTitle(e.target.value)} />
                                <input
                                    className="Input goal-teams-in goal-in"
                                    placeholder="Goal Description"
                                    value={goalDesc}
                                    onChange={(e) => setGoalDesc(e.target.value)}
                                />
                                <input
                                    className="Input goal-teams-in goal-in"
                                    placeholder="Goal Target"
                                    value={goalTarget}
                                    onChange={(e) => setGoalTarget(e.target.value)}
                                />
                                <div id="selections-goal" style={{ marginRight: '55px' }}>
                                    <select
                                        className="Select"
                                        value={exerciseName}
                                        onChange={e => setExerciseName(e.target.value)}
                                    >
                                        <option disabled={true} value="">
                                            SELECT EXERCISE
                                        </option>
                                        {exerciseList.map((ex) => (
                                            <option key={ex} value={ex}>
                                                {ex}
                                            </option>
                                        ))}
                                    </select>
                                    <select className="Select" defaultValue="" onChange={e => setGoalType(e.target.value)}>
                                        <option disabled={true} value="">
                                            SELECT TYPE
                                        </option>
                                        <option key="CARDIO" value="CST">CONSISTENCY</option>
                                        <option key="STRENGTH" value="PR">PR</option>
                                    </select>
                                    <select className="Select" defaultValue="" onChange={e => setGoalUnit(e.target.value)}>
                                        <option disabled={true} value="">
                                            SELECT UNITS
                                        </option>
                                        {goalType === "CST" ? (
                                            <>
                                                <option key="DURATION_MIN" value="DURATION_MIN">DURATION (MINS)</option>
                                                <option key="SETS" value="SETS">SETS</option>
                                            </>
                                        ) : (
                                            <>
                                                <option key="LBS" value="LBS">WEIGHT (LBS)</option>
                                                <option key="MPH" value="MPH">MPH</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                                <p>Complete By:</p>
                                <div id="selections-goal" >
                                    {goalType === "CST" && (
                                        <>
                                            <input
                                                className="Input"
                                                placeholder="MM"
                                                value={endMonth}
                                                onChange={(e) => setEndMonth(e.target.value)}
                                                style={{ width: '25px' }}
                                            />
                                            <input
                                                className="Input"
                                                placeholder="DD"
                                                value={endDay}
                                                onChange={(e) => setEndDay(e.target.value)}
                                                style={{ width: '25px' }}
                                            />
                                            <input
                                                className="Input"
                                                placeholder="YYYY"
                                                value={endYear}
                                                onChange={(e) => setEndYear(e.target.value)}
                                                style={{ width: '25px' }}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                            <button className="Button green" onClick={handleAddGoal}>Add Goal</button>
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>
            </div>
        </div>
    );
};



export default GoalsPage;
