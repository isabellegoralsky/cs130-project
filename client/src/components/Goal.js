import React, { useState, useEffect } from 'react';
import * as Progress from '@radix-ui/react-progress';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import PropTypes from 'prop-types';
import './Goal.css';

const Goal = ({ gid, title, description, savedprogress, goalvalue, name, type, unit, date, urlType }) => {
    const [progress, setProgress] = React.useState(13);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [goalDesc, setGoalDesc] = useState(description);
    const [goalProgress, setGoalProgress] = useState(savedprogress);
    const [goalTarget, setGoalTarget] = useState(goalvalue);
    const [goalTitle, setGoalTitle] = useState(title);
    const [goalType, setGoalType] = useState(type);
    const [endDate, setEndDate] = useState(date);
    const [exerciseName, setExerciseName] = useState(name);
    const [goalUnit, setGoalUnit] = useState(unit);

    const [user, setUser] = useState({});
    const [goalID, setGoalID] = useState(gid);

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

    const handleDelete = (e) => {
        setIsDeleteDialogOpen(true);
    }

    const handleCancelDelete = () => {
        console.log('Delete canceled');
        setIsDeleteDialogOpen(false);
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

    const handleConfirmDelete = async (e) => {
        e.preventDefault();
        const userId = user._id;
        if (userId) {
            const registerUrl = `http://localhost:3001/goal/${goalID}`;
            try {
                const response = await fetch(registerUrl, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                const data = await response.json();

                if (response.ok) {
                    setIsDeleteDialogOpen(false);
                    window.location.reload();
                } else {
                    throw new Error(data || 'Failed to delete goal');
                }
            } catch (error) {
                console.error('Delete Goal Error:', error);
            }
        }
    };

    const handleConfirmEdit = async (e) => {
        e.preventDefault();
        const userId = user._id;
        if (userId) {
            const updateUrl = `http://localhost:3001/goal/${goalID}`;
            const updatedData = {
                title: goalTitle,
                description: goalDesc,
                type: goalType,                 // PR/CST
                exercise: {
                    name: exerciseName,
                    amount: {
                        unit: goalUnit,     // LB/MPH for PR. SET/MIN for CST
                        value: goalTarget,
                    }
                },
                progress: goalProgress,
                endsAt: endDate,
            }
            try {
                const response = await fetch(updateUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(updatedData),
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('Successfully updated goal:', data);
                    setIsEditDialogOpen(false);

                } else {
                    throw new Error(data.message || 'Failed to update goal');
                }
            } catch (error) {
                console.error('Update Goal Error:', error);
                // Handle update error here (e.g., showing an error message)
            }
        }
    }

    const handleCancelEdit = () => {
        console.log('Edit canceled');
        setIsEditDialogOpen(false);
    };

    const handleEdit = () => {
        console.log('Edit confirmed');

        setIsEditDialogOpen(true);
    };

    useEffect(() => {
        const progress = (savedprogress / goalvalue) * 100
        const timer = setTimeout(() => setProgress(progress), 500);
        return () => clearTimeout(timer);
    }, [savedprogress, goalvalue]);

    return (
        <div class="indiv-goal">
            <div>
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <button className="IconButton" aria-label="Customise options">
                            <DotsHorizontalIcon />
                        </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                        <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
                            <DropdownMenu.Item className="DropdownMenuItem" onSelect={handleEdit}>
                                Edit Goal
                            </DropdownMenu.Item>
                            <DropdownMenu.Item className="DropdownMenuItem" onSelect={handleDelete}>
                                Delete Goal
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
                <p class="goal-d"> {title} </p>
                <p>{description}</p>
                <Progress.Root className="ProgressRoot" value={progress}>
                    <Progress.Indicator className="ProgressIndicator" style={{ transform: `translateX(-${100 - progress}%)` }} />
                </Progress.Root>
                <p class="goal-prog"> {savedprogress} / {goalvalue} </p>

                <Dialog.Root open={isDeleteDialogOpen} onClose={handleCancelDelete} class="pals-div">
                    <Dialog.Portal>
                        <Dialog.Overlay className="DialogOverlay" >
                            <Dialog.Content className="DialogContent" class="adding">
                                <Dialog.Title className="DialogTitle">Are you absolutely sure?</Dialog.Title>
                                <Dialog.Description>This action cannot be undone. This will permanently delete your goal.</Dialog.Description>
                                <Dialog.Close asChild>
                                    <button onClick={handleCancelDelete}>Cancel</button>
                                </Dialog.Close>
                                <button onClick={handleConfirmDelete}>Yes, delete goal</button>
                            </Dialog.Content>
                        </Dialog.Overlay>
                    </Dialog.Portal>
                </Dialog.Root>

                <Dialog.Root open={isEditDialogOpen} onClose={handleCancelEdit} class="pals-div">
                    <Dialog.Portal>
                        <Dialog.Overlay className="DialogOverlay" >
                            <Dialog.Content className="DialogContent" class="adding">
                                <Dialog.Title className="DialogTitle">Edit Goal</Dialog.Title>
                                <Dialog.Description>If you missed a workout post, update your progress here. Or, change your goal. / target value.</Dialog.Description>
                                <div>
                                <p>Goal Title</p>
                                    <input
                                       className="Input"
                                       placeholder={title}
                                       value={goalTitle}
                                       onChange={(e) => setGoalTitle(e.target.value)} />
                                    <select
                                        className="Select"
                                        value={exerciseName}
                                        onChange={e => setExerciseName(e.target.value)}
                                    >
                                        <option disabled={true} value={name}>
                                            {name}
                                        </option>
                                        {exerciseList.map((ex) => (
                                            <option key={ex} value={ex}>
                                                {ex}
                                            </option>
                                        ))}
                                    </select>
                                    <div style={{ display: 'flex', }}>
                                    <p>Goal Description</p>
                                        <textarea
                                            className="Input"
                                            placeholder={description}
                                            value={goalDesc}
                                            onChange={(e) => setGoalDesc(e.target.value)}
                                        />
                                        <select className="Select" defaultValue="" onChange={e => setGoalType(e.target.value)}>
                                            <option disabled={true} value={type}>
                                                {type}
                                            </option>
                                            <option key="CARDIO" value="CST">CONSISTENCY</option>
                                            <option key="STRENGTH" value="PR">PR</option>
                                        </select>
                                    </div>
                                    <p>Goal Progress</p>
                                    <input
                                        className="Input"
                                        placeholder={savedprogress}
                                        value={goalProgress}
                                        onChange={(e) => setGoalProgress(e.target.value)}
                                    />
                                     <p>Goal Target</p>
                                    <input
                                        className="Input"
                                        placeholder={goalvalue}
                                        value={goalTarget}
                                        onChange={(e) => setGoalTarget(e.target.value)}
                                    />
                                    <select className="Select" defaultValue="" onChange={e => setGoalUnit(e.target.value)}>
                                        <option disabled={true} value={unit}>
                                            {unit}
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
                                        placeholder={date ? date : "End Date"}
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />}
                                </div>
                                <Dialog.Close asChild>
                                    <button onClick={handleCancelEdit}>Cancel</button>
                                </Dialog.Close>
                                <button onClick={handleConfirmEdit}>Save Changes</button>
                            </Dialog.Content>
                        </Dialog.Overlay>
                    </Dialog.Portal>
                </Dialog.Root>

            </div>
        </div>
    );
};

Goal.propTypes = {
    description: PropTypes.string.isRequired,
    savedprogress: PropTypes.number.isRequired,
    goalvalue: PropTypes.number.isRequired,
};

export default Goal;