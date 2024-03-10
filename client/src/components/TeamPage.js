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
                <Dialog.Title className="DialogTitle">Add a Team Goal</Dialog.Title>
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

  const handleAddGoal = async (e) => { }

  return (
    <div>
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
