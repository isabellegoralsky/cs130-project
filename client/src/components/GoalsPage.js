import React, { useState } from 'react';
import Goal from './Goal';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import './GoalsPage.css'

const GoalsPage = () => {
    const [exerciseName, setExerciseName] = useState('');
    const [goalTitle, setGoalTitle] = useState('');
    const [goalDesc, setGoalDesc] = useState('');
    const [goalType, setGoalType] = useState('');
    const [goalTarget, setGoalTarget] = useState('');
    const [unit, setUnit] = useState('');
    const [endDate, setEndDate] = useState('');

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

    const samplegoals = [
        { title: "Goal 1", description: "do something", savedprogress: 75 },
        { title: "Goal 2", description: "do something", savedprogress: 50 },
        { title: "Goal 3", description: "do something", savedprogress: 25 }
    ];

    const handleAddGoal = async (e) => { }

    return (
        <div className="goals-page">
            <h2 id="my-goals">MY GOALS</h2>
            <div id="goals-div">
                <div className="column">
                    <h2 class="goal-header">PERSONAL RECORD</h2>
                    {samplegoals.map((goal, index) => (
                        <Goal key={index} title={goal.title} description={goal.description} savedprogress={goal.savedprogress} goalvalue={100} />
                    ))}
                </div>
                <div className="column">
                    <h2 class="goal-header">CONSISTENCY</h2>
                    {samplegoals.map((goal, index) => (
                        <Goal key={index} title={goal.title}  description={goal.description} savedprogress={goal.savedprogress} goalvalue={100} />
                    ))}
                </div>
            </div>
            <div>
                <Dialog.Root>
                    <Dialog.Trigger asChild>
                        <div id="another-goal">
                            <span classname="ClickableText">add another goal?</span>
                        </div>
                    </Dialog.Trigger>
                    <Dialog.Portal>
                        <Dialog.Overlay className="DialogOverlay" />
                        <Dialog.Content className="DialogContent">
                            <Dialog.Title className="DialogTitle">Add a Goal</Dialog.Title>
                            <div>
                                <input
                                    className="Input"
                                    placeholder="Goal Title"
                                    value={goalTitle}
                                    onChange={(e) => setGoalTitle(e.target.value)} />
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
                                <div style={{ display: 'flex', }}>
                                    <textarea
                                        className="Input"
                                        placeholder="Goal Description"
                                        value={goalDesc}
                                        onChange={(e) => setGoalDesc(e.target.value)}
                                    />
                                    <select className="Select" defaultValue="" onChange={e => setGoalType(e.target.value)}>
                                        <option disabled={true} value="">
                                            SELECT TYPE
                                        </option>
                                        <option key="CARDIO" value="CST">CONSISTENCY</option>
                                        <option key="STRENGTH" value="PR">PR</option>
                                    </select>
                                </div>
                                <input
                                    className="Input"
                                    placeholder="Goal Target"
                                    value={goalTarget}
                                    onChange={(e) => setGoalTarget(e.target.value)}
                                />
                                <select className="Select" defaultValue="" onChange={e => setUnit(e.target.value)}>
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
                                {goalType === "CST" && <input
                                    className="Input"
                                    placeholder="End Date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />}
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
