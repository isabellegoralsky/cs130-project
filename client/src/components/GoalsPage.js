import React, { useState } from 'react';
import Goal from './Goal';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import './GoalsPage.css'

const GoalsPage = () => {

    const [goalType, setGoalType] = useState(null);
    const samplegoals = [
        { description: "Goal 1", savedprogress: 75 },
        { description: "Goal 2", savedprogress: 50 },
        { description: "Goal 3", savedprogress: 25 }
    ];

    return (
        <div className="goals-page">
            <h2 id="my-goals">MY GOALS</h2>
            <div id="goals-div">
                <div className="column">
                    <h2 class="goal-header">PERSONAL RECORD</h2>
                    {samplegoals.map((goal, index) => (
                        <Goal key={index} description={goal.description} savedprogress={goal.savedprogress} goalvalue={100} />
                    ))}
                </div>
                <div className="column">
                    <h2 class="goal-header">CONSISTENCY</h2>
                    {samplegoals.map((goal, index) => (
                        <Goal key={index} description={goal.description} savedprogress={goal.savedprogress} goalvalue={100} />
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
                            <Dialog.Description className="DialogDescription">
                                What type of goal would you like to set?
                            </Dialog.Description>
                            <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}>
                                <Dialog.Close asChild>
                                    <button onClick={() => setGoalType('consistency')}>Consistency Goal</button>
                                </Dialog.Close>
                                <Dialog.Close asChild>
                                    <button onClick={() => setGoalType('pr')}>PR Goal</button>
                                </Dialog.Close>
                            </div>
                            <Dialog.Close asChild>
                                <button className="IconButton" aria-label="Close">
                                    <Cross2Icon />
                                </button>
                            </Dialog.Close>
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>
            </div>
            {goalType && goalType === 'consistency' && (
                <ConsistencyGoalModal onClose={() => setGoalType(null)} />
            )}
            {goalType && goalType === 'pr' && (
                <PRGoalModal onClose={() => setGoalType(null)} />
            )}
        </div>
    );
};

const ConsistencyGoalModal = ({ onClose }) => {
    const [exerciseName, setExerciseName] = useState('');
    const [goalDesc, setGoalDesc] = useState(''); //done
    const [exerciseType, setExerciseType] = useState(''); //done
    const [goalTarget, setGoalTarget] = useState(''); //done
    const [unit, setUnit] = useState(''); //done
    const [per, setPer] = useState(''); //done
    //need exercise which has additional fields name, sets, reps, unit, amount

    return (
        <div>
            <Dialog.Root open>
                <Dialog.Portal>
                    <Dialog.Overlay className="DialogOverlay" />
                    <Dialog.Content className="DialogContent">
                        <Dialog.Close asChild>
                            <button className="IconButton" aria-label="Close" onClick={onClose}>
                                <Cross2Icon />
                            </button>
                        </Dialog.Close>
                        <Dialog.Title className="DialogTitle">Add a Consistency Goal</Dialog.Title>
                        <div>
                            <input
                                className="Input"
                                placeholder="Exercise Name"
                                value={exerciseName}
                                onChange={(e) => setExerciseName(e.target.value)} />
                            <div style={{ display: 'flex', }}>
                                <textarea
                                    className="Input"
                                    placeholder="Goal Description"
                                    value={goalDesc}
                                    onChange={(e) => setGoalDesc(e.target.value)}
                                />
                                <select className="Select" defaultValue="" onChange={e => setExerciseType(e.target.value)}>
                                    <option disabled={true} value="">
                                        EXERCISE TYPE
                                    </option>
                                    <option key="CARDIO" value="CARDIO">CARDIO</option>
                                    <option key="STRENGTH" value="STRENGTH">STRENGTH</option>
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
                                    UNITS
                                </option>
                                <option key="DURATION_MIN" value="DURATION_MIN">DURATION (MINS)</option>
                                <option key="SETS" value="SETS">SETS</option>
                                <option key="REPS" value="REPS">REPS</option>
                                <option key="COUNT" value="COUNT">COUNT</option>
                            </select>

                            <div style={{ display: 'flex', }}>
                                <p>per</p>
                                <select className="Select" defaultValue="" onChange={e => setPer(e.target.value)}>
                                    <option disabled={true} value="">
                                        TIMEFRAME
                                    </option>
                                    <option key="DAY" value="DAY">DAY</option>
                                    <option key="WEEK" value="WEEK">WEEK</option>
                                    <option key="MONTH" value="MONTH">MONTH</option>
                                </select>
                            </div>
                        </div>
                        <button className="Button green" onClick={onClose}>Add Goal</button>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
};

const PRGoalModal = ({ onClose }) => {
    const [exerciseName, setExerciseName] = useState('');
    const [goalDesc, setGoalDesc] = useState(''); //done
    const [exerciseType, setExerciseType] = useState(''); //done
    const [goalTarget, setGoalTarget] = useState(''); //done
    const [unit, setUnit] = useState(''); //done
    const [per, setPer] = useState(''); //done
    //need exercise which has additional fields name, sets, reps, unit, amount

    return (
        <div>
            <Dialog.Root open>
                <Dialog.Portal>
                    <Dialog.Overlay className="DialogOverlay" />
                    <Dialog.Content className="DialogContent">
                        <Dialog.Close asChild>
                            <button className="IconButton" aria-label="Close" onClick={onClose}>
                                <Cross2Icon />
                            </button>
                        </Dialog.Close>
                        <Dialog.Title className="DialogTitle">Add a PR Goal</Dialog.Title>
                        <div>
                            <input
                                className="Input"
                                placeholder="Exercise Name"
                                value={exerciseName}
                                onChange={(e) => setExerciseName(e.target.value)} />
                            <div style={{ display: 'flex', }}>
                                <textarea
                                    className="Input"
                                    placeholder="Goal Description"
                                    value={goalDesc}
                                    onChange={(e) => setGoalDesc(e.target.value)}
                                />
                                <select className="Select" defaultValue="" onChange={e => setExerciseType(e.target.value)}>
                                    <option disabled={true} value="">
                                        EXERCISE TYPE
                                    </option>
                                    <option key="CARDIO" value="CARDIO">CARDIO</option>
                                    <option key="STRENGTH" value="STRENGTH">STRENGTH</option>
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
                                    UNITS
                                </option>
                                <option key="DURATION_MIN" value="DURATION_MIN">DURATION (MINS)</option>
                                <option key="WEIGHT" value="SETS">WEIGHT (LBS)</option>
                            </select>
                        </div>
                        <button className="Button green" onClick={onClose}>Add Goal</button>

                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
};

export default GoalsPage;
