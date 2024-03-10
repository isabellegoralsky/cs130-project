// TeamPage.js
import React, { useState, useEffect } from 'react';
import Carousel from './Carousel';
import * as Dialog from '@radix-ui/react-dialog';
import './Teams.css';

const TeamPage = ({ teams, updates, achievements, posts }) => {
  const [selectedTeam, setSelectedTeam] = useState(teams.length > 0 ? teams[0] : '');

  useEffect(() => {
    // Automatically select the first team when the component mounts
    if (teams.length > 0) {
      setSelectedTeam(teams[0]);
    }
  }, [teams]);

  const handleTeamChange = (event) => {
    const teamId = event.target.value;
    const team = teams.find(t => t.id.toString() === teamId);
    setSelectedTeam(team);
  };

  return (
    <div className="team-page">
      <div className="team-selector">
        <label htmlFor="team-dropdown" id="label-drop">Select Team</label>
        <select id="team-dropdown" onChange={handleTeamChange} value={selectedTeam?.id || ''}>
          <option disabled={true} value="">
            Select a Team
          </option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>
      </div>
      <div>
        <Dialog.Root class="pals-div">
          <h2 class="teams-sections">Updates</h2>
          <Dialog.Trigger asChild>
            <button className="" class="">
              <img class="add-pal-img" src="https://drive.google.com/thumbnail?id=1EqwyGYxBns9dZixaFfKm549nYskLIMWw" alt="pin a workout" />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="DialogOverlay" >
              <Dialog.Content className="DialogContent" class="adding">
                <Dialog.Title className="DialogTitle">Add a Team Update</Dialog.Title>
                <TeamUpdateModal />
              </Dialog.Content>
            </Dialog.Overlay>
          </Dialog.Portal>
        </Dialog.Root>
        <Carousel items={updates[selectedTeam?.id] || ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']} />
        <Dialog.Root class="pals-div">
          <h2 class="teams-sections">Team Goals</h2>
          <Dialog.Trigger asChild>
            <button className="" class="">
              <img class="add-pal-img" src="https://drive.google.com/thumbnail?id=1EqwyGYxBns9dZixaFfKm549nYskLIMWw" alt="pin a workout" />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="DialogOverlay" >
              <Dialog.Content className="DialogContent" class="adding">
                <Dialog.Title className="DialogTitle">Add a Team Consistency Goal</Dialog.Title>
                <ConsistencyGoalModal />
              </Dialog.Content>
            </Dialog.Overlay>
          </Dialog.Portal>
        </Dialog.Root>
        <Carousel items={achievements[selectedTeam?.id] || ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']} />
        <h2 class="teams-sections">Member Posts</h2>
        <Carousel items={posts[selectedTeam?.id] || ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']} />

      </div>
    </div >
  );
};

const TeamUpdateModal = () => {
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateBody, setUpdateBody] = useState('');

  return (
    <div>
      <div>
        <input
          className="Input"
          placeholder="Update Title"
          value={updateTitle}
          onChange={(e) => setUpdateTitle(e.target.value)} />
      </div>
      <textarea
        className="Input"
        placeholder="Write an update here..."
        value={updateBody}
        onChange={(e) => setUpdateBody(e.target.value)}
      />
      <button className="Button green">Post Update</button>
    </div>
  )
};

const ConsistencyGoalModal = () => {
  const [exerciseName, setExerciseName] = useState('');
  const [goalDesc, setGoalDesc] = useState('');
  const [exerciseType, setExerciseType] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [unit, setUnit] = useState('');
  const [per, setPer] = useState('');

  return (
    <div>
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
      <button className="Button green">Add Goal</button>
    </div>
  );
};

export default TeamPage;

// Sample CSS
/*
.team-page {
  padding: 20px;
}

.team-selector {
  margin-bottom: 20px;
}

label {
  margin-right: 10px;
}

select {
  padding: 5px;
  margin-right: 20px;
}
*/
