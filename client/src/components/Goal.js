import React from 'react';
import * as Progress from '@radix-ui/react-progress';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import PropTypes from 'prop-types';
import './Goal.css';

const Goal = ({ description, savedprogress, goalvalue }) => {
    const [progress, setProgress] = React.useState(13);

    const handleDelete = (e) => {
        console.log('clicked delete');
    }
    React.useEffect(() => {
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
                            <DropdownMenu.Item className="DropdownMenuItem" >
                                Edit Goal
                            </DropdownMenu.Item>
                            <DropdownMenu.Item className="DropdownMenuItem" onSelect={handleDelete}>
                                Delete Goal
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
                <p class="goal-d"> {description} </p>
                <Progress.Root className="ProgressRoot" value={progress}>
                    <Progress.Indicator className="ProgressIndicator" style={{ transform: `translateX(-${100 - progress}%)` }} />
                </Progress.Root>
                <p class="goal-prog"> {savedprogress} / {goalvalue} </p>
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