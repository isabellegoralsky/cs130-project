import React, { useState, useEffect } from 'react';
import * as Progress from '@radix-ui/react-progress';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import PropTypes from 'prop-types';
import './Goal.css';

const Goal = ({ gid, title, description, savedprogress, goalvalue }) => {
    const [progress, setProgress] = React.useState(13);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [goalDesc, setGoalDesc] = useState(description);
    const [goalProgress, setGoalProgress] = useState(savedprogress);
    const [goalTarget, setGoalTarget] = useState(goalvalue);
    const [goalTitle, setGoalTitle] = useState(title);
    const [user, setUser] = useState({});
    const [goalID, setGoalID] = useState(gid);

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

    const handleEdit = (e) => {
        setIsEditDialogOpen(true);
    }

    const handleCancelEdit = () => {
        console.log('Edit canceled');
        setIsEditDialogOpen(false);
    };

    const handleConfirmEdit = () => {
        console.log('Edit confirmed');
        setIsEditDialogOpen(false);
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
                                <Dialog.Description>If you missed a workout post, update your progress here. Or, change your description / target value.</Dialog.Description>
                                <div>
                                    <p>Goal Title</p>
                                    <textarea
                                        className="Input"
                                        placeholder={title}
                                        value={goalTitle}
                                        onChange={(e) => setGoalTitle(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <p>Goal Description</p>
                                    <textarea
                                        className="Input"
                                        placeholder={description}
                                        value={goalDesc}
                                        onChange={(e) => setGoalDesc(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <p>Goal Progress</p>
                                    <input
                                        className="Input"
                                        placeholder={savedprogress}
                                        value={goalProgress}
                                        onChange={(e) => setGoalProgress(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <p>Goal Target</p>
                                    <input
                                        className="Input"
                                        placeholder={goalvalue}
                                        value={goalTarget}
                                        onChange={(e) => setGoalTarget(e.target.value)}
                                    />
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