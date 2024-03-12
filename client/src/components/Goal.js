import React, { useState, useEffect } from 'react';
import * as Progress from '@radix-ui/react-progress';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import PropTypes from 'prop-types';
import './Goal.css';

const Goal = ({ teamid, gid, title, description, savedprogress, goalvalue, name, type, unit, date }) => {
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
            let goalUrl = ``;
            if (teamid) {
                goalUrl = `http://localhost:3001/team-goal/${gid}`;
            }
            else {
                goalUrl = `http://localhost:3001/goal/${gid}`;
            }
            try {
                const response = await fetch(goalUrl, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ teamId: teamid }),
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
            let goalUrl = ``;
            if (teamid) {
                goalUrl = `http://localhost:3001/team-goal/${gid}`;
            }
            else {
                goalUrl = `http://localhost:3001/goal/${gid}`;
            }
            const updatedData = {
                title: goalTitle,
                description: goalDesc,
                type: goalType,                
                exercise: {
                    name: exerciseName,
                    amount: {
                        unit: goalUnit,     
                        value: goalTarget,
                    }
                },
                progress: goalProgress,
                endsAt: endDate,
                teamId: teamid,
            }
            try {
                const response = await fetch(goalUrl, {
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
                        <button className="IconButton edit-goal" aria-label="Customise options">
                            <DotsHorizontalIcon />
                        </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                        <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
                            <DropdownMenu.Item className="DropdownMenuItem edit-goal-del" onSelect={handleEdit}>
                                Edit Goal
                            </DropdownMenu.Item>
                            <DropdownMenu.Item className="DropdownMenuItem edit-goal-del" onSelect={handleDelete}>
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
                                <Dialog.Description class="descript-thing">This action cannot be undone. This will permanently delete your goal.</Dialog.Description>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Dialog.Close asChild>
                                        <button onClick={handleCancelDelete} class="edit-goal-cancel">Cancel</button>
                                    </Dialog.Close>
                                    <button onClick={handleConfirmDelete} class="Button green">Yes, delete goal</button>
                                </div>
                            </Dialog.Content>
                        </Dialog.Overlay>
                    </Dialog.Portal>
                </Dialog.Root>

                <Dialog.Root open={isEditDialogOpen} onClose={handleCancelEdit} class="pals-div">
                    <Dialog.Portal>
                        <Dialog.Overlay className="DialogOverlay" >
                            <Dialog.Content className="DialogContent" class="adding">
                                <Dialog.Title className="DialogTitle">Edit Goal</Dialog.Title>
                                <Dialog.Description class="edit-g-title">If you missed a workout post, update your progress here. Or change your goal / target value.</Dialog.Description>
                                <div class='editing-g'>
                                    <p style={{marginBottom: '5px'}}>Goal Title</p>
                                    <input
                                        className="Input"
                                        placeholder={title}
                                        value={goalTitle}
                                        style={{ width: '95%' }}
                                        onChange={(e) => setGoalTitle(e.target.value)} />
                                    <p style={{marginBottom: '5px'}}>Goal Description</p>
                                    <input
                                            className="Input"
                                            placeholder={description}
                                            value={goalDesc}
                                            style={{ width: '95%' }}
                                            onChange={(e) => setGoalDesc(e.target.value)}
                                    />
                                    <p style={{marginBottom: '5px'}}>Goal Progress</p>
                                    <input
                                        className="Input"
                                        placeholder={savedprogress}
                                        value={goalProgress}
                                        style={{ width: '95%' }}
                                        onChange={(e) => setGoalProgress(e.target.value)}
                                    />
                                    <p style={{marginBottom: '5px'}}>Goal Target</p>
                                    <input
                                        className="Input"
                                        placeholder={goalvalue}
                                        value={goalTarget}
                                        style={{ width: '95%' }}
                                        onChange={(e) => setGoalTarget(e.target.value)}
                                    />
                                    <div class="selectors-goal-stuff" style={{marginTop:'20px'}}>
                                        <div>
                                        <select className="Select" style={{marginRight:22}} defaultValue="" onChange={e => setGoalType(e.target.value)}>
                                                    <option disabled={true} value={type}>
                                                        {type}
                                                    </option>
                                                    <option key="CARDIO" value="CST">CONSISTENCY</option>
                                                    <option key="STRENGTH" value="PR">PR</option>
                                            </select>
                                            <select
                                                className="Select"
                                                style={{marginRight:22}}
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
                                            <select style={{marginRight:0}} className="Select" defaultValue="" onChange={e => setGoalUnit(e.target.value)}>
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
                                        </div>
                                            
                                        
                                        {goalType === "CST" && (<>
                                            <div class="cst-goal-date">
                                                <p>Complete By:</p>
                                                <div>
                                                    <input
                                                    className="Input dateSS"
                                                    placeholder={date ? date : "End Date"}
                                                    value={endDate}
                                                    onChange={(e) => setEndDate(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </>)}
                                    </div>
                                </div>
                                <Dialog.Close asChild>
                                    <button onClick={handleCancelEdit} class="cancel-edit-g">x</button>
                                </Dialog.Close>
                                <button onClick={handleConfirmEdit} class ="Button green" style={{float:'right', marginTop:'30px'}}>Save Changes</button>
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