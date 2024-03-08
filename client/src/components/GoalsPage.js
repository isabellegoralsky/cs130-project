import React from 'react';
import Goal from './Goal';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import './GoalsPage.css'

const GoalsPage = () => {

    const handleCreateGoal = (e) => {
        //TODO
    }
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
                                Add a description for the goal and a target you would like to hit.
                            </Dialog.Description>
                            <fieldset className="Fieldset">
                                <label className="Label" htmlFor="description">
                                    Description
                                </label>
                                <input className="Input" id="description" />
                            </fieldset>
                            <fieldset className="Fieldset">
                                <label className="Label" htmlFor="target">
                                    Goal Target
                                </label>
                                <input className="Input" id="target" />
                            </fieldset>
                            <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}>
                                <Dialog.Close asChild>
                                    <button onClick={handleCreateGoal}>Create Goal</button>
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
        </div>
    );
};

export default GoalsPage;
