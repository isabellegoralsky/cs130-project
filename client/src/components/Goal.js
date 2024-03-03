import React from 'react';
import * as Progress from '@radix-ui/react-progress';
import PropTypes from 'prop-types';
import './Goal.css';

const Goal = ({ description, savedprogress, goalvalue }) => {
    const [progress, setProgress] = React.useState(13);

    React.useEffect(() => {
        const progress = (savedprogress / goalvalue) * 100
        const timer = setTimeout(() => setProgress(progress), 500);
        return () => clearTimeout(timer);
    }, [savedprogress, goalvalue]);

    return (
        <div style={{
            display: 'flex',
            width: '300px',
            minHeight: '100px',
            padding: '20px',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#eee',
            borderRadius: '15px',
            margin: '10px'
        }}>
            <div>
                <p> {description} </p>
                <Progress.Root className="ProgressRoot" value={progress}>
                    <Progress.Indicator className="ProgressIndicator" style={{ transform: `translateX(-${100 - progress}%)` }} />
                </Progress.Root>
                <p> {savedprogress} / {goalvalue} </p>
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