import React, { useState, useEffect } from 'react';
import Goal from './Goal';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import './GoalsPage.css'

/**
     * Construct the user's goals page.
     *
     * @name GoalsPage
     * @constructor
     */
const GoalsPage = () => {
    const [user, setUser] = useState({});
    const [goals, setGoals] = useState([]);

    useEffect(() => {
        //fetch user
        async function fetchUser() {
            try {
                const url = `/user`;
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
                const url = `/goal/`;

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
            <div style={{textAlign: 'center', marginTop: '20px'}}>
                <Dialog.Root>
                    <Dialog.Trigger asChild>
                        <span classname="ClickableText" id="another-goal" >add another goal?</span>
                    </Dialog.Trigger>
                    <Dialog.Portal>
                        <Dialog.Overlay className="DialogOverlay" >
                            <Dialog.Content className="DialogContent" class="adding2">
                                <Dialog.Title className="DialogTitle">Add a Goal</Dialog.Title>
                                <GoalModal u={user} />
                            </Dialog.Content>
                        </Dialog.Overlay>
                    </Dialog.Portal>
                </Dialog.Root>
            </div>
        </div>
    );
};

/**
     * Create a pop up for user to be able to create a goal.
     *
     * @name GoalModal
     * @constructor
     * @param {u} u - user
     */
const GoalModal = ({ u }) => {
    const [exerciseName, setExerciseName] = useState('');
    const [goalTitle, setGoalTitle] = useState('');
    const [goalDesc, setGoalDesc] = useState('');
    const [goalType, setGoalType] = useState('');
    const [goalTarget, setGoalTarget] = useState('');
    const [goalUnit, setGoalUnit] = useState('');
    const [endMonth, setEndMonth] = useState('');
    const [endDay, setEndDay] = useState('');
    const [endYear, setEndYear] = useState('');


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

    /**
         * Handle user request to create a goal.
         *
         * @name handleAddGoal
         * @function
         * @param {e} e - event
         */
    const handleAddGoal = async (e) => {
        e.preventDefault();
        const formdata = {
            userId: u._id,
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
        const registerUrl = '/goal/';
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
                window.location.reload();
            } else {
                throw new Error(data || 'Failed to add goal');
            }
        } catch (error) {
            console.error('Add Goal Error:', error);
        }
    };

    return (
        <div>
            <div class="teams-goal-pop">
                <input
                    className="Input goal-teams-in"
                    placeholder="Goal Title"
                    value={goalTitle}
                    onChange={(e) => setGoalTitle(e.target.value)} />
                <input
                    className="Input goal-teams-in"
                    placeholder="Goal Description"
                    value={goalDesc}
                    onChange={(e) => setGoalDesc(e.target.value)}
                />
                <input
                    className="Input goal-teams-in"
                    placeholder="Goal Target"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                />
                <div id="selections-goal">
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
                <div id="selections-goal" >
                    {goalType === "CST" && (
                        <>
                        <div class="cst-goal-date">
                            <p>Complete By:</p>
                            <div>
                                <input
                                    className="Input dateSS"
                                    placeholder="MM"
                                    value={endMonth}
                                    onChange={(e) => setEndMonth(e.target.value)}
                                    style={{ width: '25px' }}
                                />
                                <input
                                    className="Input dateSS"
                                    placeholder="DD"
                                    value={endDay}
                                    onChange={(e) => setEndDay(e.target.value)}
                                    style={{ width: '25px' }}
                                />
                                <input
                                    className="Input dateSS"
                                    placeholder="YYYY"
                                    value={endYear}
                                    onChange={(e) => setEndYear(e.target.value)}
                                    style={{ width: '40px' }}
                                />
                            </div>
                            
                        </div>
                        </>
                    )}
                </div>
            </div>
            <Dialog.Close asChild>
                <button className="Button green" onClick={handleAddGoal}>Add Goal</button>
            </Dialog.Close>
        </div>
    );
};
export default GoalsPage;
