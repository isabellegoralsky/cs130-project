// TeamPage.js
import React, { useState, useEffect } from 'react';
import Carousel from './Carousel';
import ACarousel from './AchCarousel';
import * as Dialog from '@radix-ui/react-dialog';
import './Teams.css';
import Goal from './Goal.js';

/**
  * Construct the user's team page.
  *
  * @name TeamPage
  * @constructor
  */
const TeamPage = () => {
  const [user, setUser] = useState({});
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(teams.length > 0 ? teams[0] : '');
  const [posts, setPosts] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    // Automatically select the first team when the component mounts
    if (teams.length > 0) {
      setSelectedTeam(teams[0]);
    }
  }, [teams]);

  useEffect(() => {
    if (selectedTeam === '') {
      return;
    }
    
    (async () => {
      try {
        console.log("selectedTeam.id", selectedTeam.id);
        const response = await fetch(`/user/${selectedTeam.id}/teampage`, {
          credentials: 'include',
        });
        const data = await response.json();
        console.log("data", data);
        setUpdates(data.announcements);
        setPosts(data.teampost)
        if (response.ok) {
          const goalResponse = await fetch(`/team-goal/${selectedTeam.id}`, {
            credentials: 'include'
          });
          const goalData = await goalResponse.json();
          setAchievements(goalData);
          
        } else {
          throw new Error(data.message || 'Failed to get team details');
        }

        
      } catch (error) {
        console.error('Error:', error);
        // Handle error here (e.g., showing an error message)
      }
    })();

  }, [selectedTeam])

  useEffect(() => {
    (async () => {
      try {
        let response = await fetch("/user/", {
          credentials: 'include',
        });
        let data = await response.json();

        if (response.ok) {
          console.log('Get User Success:', data);
        } else {
          throw new Error(data.message || 'Failed to login');
        }
        setUser(data);

        response = await fetch(`/user/${data._id}/teams`, {
          credentials: 'include',
        });

        data = await response.json();

        if (response.ok) {
          console.log('Get Teams Success:', data);
        } else {
          throw new Error(data.message || 'Failed to login');
        }
        setTeams(data);

      } catch (error) {
        console.error('Error:', error);
      }
    })();
  }, []);

  /**
  * Handle user request to switch the team they are viewing via the dropdown menu.
  *
  * @name handleTeamChange
  * @function
  * @param {e} e - event
  */
  const handleTeamChange = (event) => {
    const teamName = event.target.value;
    const team = teams.find(t => t.name.toString() === teamName);
    setSelectedTeam(team);
  };

  return (
    <div className="team-page">
      <div className="team-selector">
        <label htmlFor="team-dropdown" id="label-drop">Select Team</label>
        <select id="team-dropdown" onChange={handleTeamChange} value={selectedTeam?.name || ''}>
          <option disabled={true} value="">
            Select a Team
          </option>
          {(teams || []).map(team => (
            <option key={team.name} value={team.name}>{team.name}</option>
          ))}
        </select>
      </div>
      <div>
        <h2 class="teams-sections">Updates</h2>
        <Dialog.Root class="pals-div">
          <Dialog.Trigger asChild>
            <button className="" class="teams-clicks">
              <img class="add-pal-img" src="https://drive.google.com/thumbnail?id=1EqwyGYxBns9dZixaFfKm549nYskLIMWw" alt="pin a workout" />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="DialogOverlay" >
              <Dialog.Content className="DialogContent" class="adding2">
                <Dialog.Title className="DialogTitle">Add a Team Update</Dialog.Title>
                <TeamUpdateModal teamId={selectedTeam?.id} />
              </Dialog.Content>
            </Dialog.Overlay>
          </Dialog.Portal>
        </Dialog.Root>
        <Carousel items={updates.length > 0 ? updates.map((update) => ({
          content: <>
            <div class="an-update">
              <div class="update-title">{update.title}</div>
              <div class="update-name">{update.name}</div>
              <div class="update-note">{update.note}</div>
            </div>
            </>
          })) : ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']} /*title="Announcements"*/ />
        <h2 class="teams-sections">Team Goals</h2>
        <Dialog.Root class="pals-div">
          <Dialog.Trigger asChild>
            <button className="" class="teams-clicks">
              <img class="add-pal-img" src="https://drive.google.com/thumbnail?id=1EqwyGYxBns9dZixaFfKm549nYskLIMWw" alt="pin a workout" />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="DialogOverlay" >
              <Dialog.Content className="DialogContent" class="adding2">
                <Dialog.Title className="DialogTitle">Add a Team Goal</Dialog.Title>
                <GoalModal u={user} />
              </Dialog.Content>
            </Dialog.Overlay>
          </Dialog.Portal>
        </Dialog.Root>
        <ACarousel items={achievements.length > 0 ? achievements.map((achievement, index) => ({
          content: <Goal key={index} title={achievement.title}
            description={achievement.description || ''}
            savedprogress={achievement.progress}
            teamid={selectedTeam?.id}
            gid={achievement._id}
            goalvalue={achievement.exercise.amount.value}
            name={achievement.exercise.name}
            type={achievement.type}
            unit={achievement.exercise.amount.unit}
            date={achievement.endsAt}></Goal>
        })) : ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']} />
        <CreateTeamDialog></CreateTeamDialog>
        <JoinTeamDialog></JoinTeamDialog>
      </div>
    </div>)
};

/**
  * Create the pop up for the user to be able to make a team.
  *
  * @name CreateTeamDialog
  * @constructor
  */
const CreateTeamDialog = () => {
  const [teamName, setTeamName] = useState('');

  const handleCreateTeam = async (event) => {
    try {
      let response = await fetch('/user/createteam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          teamName
        })
      });
      let data = await response.json();

      if (response.ok) {
        console.log('Create New Team Success:', data);
      } else {
        throw new Error(data.message || 'Failed to login');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  return <Dialog.Root>
    <Dialog.Trigger asChild>
        <div id="create-team" class="create-join" style={{marginTop: '40px'}}>
            <span classname="ClickableText">create a new team?</span>
        </div>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="DialogOverlay" />
      <Dialog.Content className="DialogContent">
        <Dialog.Title className="DialogTitle">Create a Team</Dialog.Title>
        <Dialog.Description className="DialogDescription">
          Name your new team.
        </Dialog.Description>
        <fieldset className="Fieldset">
          <label className="Label" htmlFor="name">
            Name
          </label>
          <input
            className="name"
            class="Input"
            id="name"
            onChange={(e) => { setTeamName(e.target.value); }} />
        </fieldset>

        <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}>
          <Dialog.Close asChild>
            <button onClick={handleCreateTeam} class="Button green">Create Team</button>
          </Dialog.Close>
        </div>
        <Dialog.Close asChild>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}

/**
  * Create the pop up for the user to be able to join a team.
  *
  * @name JoinTeamDialog
  * @constructor
  */
const JoinTeamDialog = () => {
  const [teamId, setTeamId] = useState('');
  const handleJoinTeam = async (event) => {

    try {
      let response = await fetch(`/user/jointeam/${teamId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      let data = await response.json();

      if (response.ok) {
        console.log('Create New Team Success:', data);
      } else {
        throw new Error(data.message || 'Failed to login');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return <Dialog.Root>
    <Dialog.Trigger asChild>
        <div id="create-team" class="create-join" style={{marginTop: '10px'}}>
            <span classname="ClickableText">join a team?</span>
        </div>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="DialogOverlay" />
      <Dialog.Content className="DialogContent">
        <Dialog.Title className="DialogTitle">Join a Team</Dialog.Title>
        <Dialog.Description className="DialogDescription">
          Enter Team Name.
        </Dialog.Description>
        <fieldset className="Fieldset">
          <label className="Label" htmlFor="name">
            Name
          </label>
          <input
            className="teamId"
            id="teamId"
            class="Input"
            onChange={(e) => { setTeamId(e.target.value); }} />
        </fieldset>

        <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}>
          <Dialog.Close asChild>
            <button onClick={handleJoinTeam} class="Button green">Join Team</button>
          </Dialog.Close>
        </div>
        <Dialog.Close asChild>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}

/**
  * Create the functionality for the user to be able to update a team.
  *
  * @name TeamUpdateModal
  * @constructor
  * @param {teamId} teamId - team ID of desired team to update.
  */
const TeamUpdateModal = ({ teamId }) => {
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateBody, setUpdateBody] = useState('');

  /**
  * Create the pop up for the user to be able to make a team.
  *
  * @name handleUpdate
  * @function
  * @param {event} event - e
  */
  const handleUpdate = async (event) => {
    try {
      let response = await fetch(`/post/addteampost/${teamId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: updateTitle,
          note: updateBody
        })
      });
      let data = await response.json();

      if (response.ok) {
        console.log('Update Team Post Success:', data);
      } else {
        throw new Error(data.message || 'Failed to login');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <div class="team-update-pop">
        <input
          className="Input"
          placeholder="Update Title"
          value={updateTitle}
          style={{ marginBottom: '6px' }}
          onChange={(e) => setUpdateTitle(e.target.value)} />
        <input
          className="Input"
          placeholder="Write an update here..."
          value={updateBody}
          onChange={(e) => setUpdateBody(e.target.value)}
        />
      </div>
      <Dialog.Close asChild>
        <button className="Button green" onClick={handleUpdate}>Post Update</button>
      </Dialog.Close>
    </div>
  )
};

/**
     * Create a pop up for user to be able to create a team goal.
     *
     * @name TeamGoalModal
     * @constructor
     * @param {u} u - user
     */
const GoalModal = ({ u }) => {
  const [exerciseName, setExerciseName] = useState('');
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDesc, setGoalDesc] = useState('');
  const [goalType, setGoalType] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalUnit, setGoalUnit] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [endDay, setEndDay] = useState('');
  const [endYear, setEndYear] = useState('');


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

  /**
         * Handle user request to create a goal.
         *
         * @name handleAddTeamGoal
         * @function
         * @param {e} e - event
         */
  const handleAddGoal = async (e) => {
      e.preventDefault();
      const formdata = {
          userId: u._id,
          title: goalTitle,
          description: goalDesc,
          type: goalType,
          exercise: {
              name: exerciseName,
              amount: {
                  unit: goalUnit,     // LB/MPH for PR. SET/MIN for CST
                  value: goalTarget

              }
          },
          endDate: new Date(endYear, endMonth, endDay)
      };
      console.log(formdata);
      const registerUrl = '/goal/';
      try {
          const response = await fetch(registerUrl, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(formdata),
              credentials: 'include',
          });

          const data = await response.json();

          if (response.ok) {
              console.log(data);
              setGoalTitle('');
              setGoalDesc('');
              setGoalType('');
              setExerciseName('');
              setGoalTarget('');
              setGoalUnit('');
              setEndDay('');
              setEndMonth('');
              setEndYear('');
              window.location.reload();
          } else {
              throw new Error(data || 'Failed to add goal');
          }
      } catch (error) {
          console.error('Add Goal Error:', error);
      }
  };

  return (
      <div>
          <div class="teams-goal-pop">
              <input
                  className="Input goal-teams-in"
                  placeholder="Goal Title"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)} />
              <input
                  className="Input goal-teams-in"
                  placeholder="Goal Description"
                  value={goalDesc}
                  onChange={(e) => setGoalDesc(e.target.value)}
              />
              <input
                  className="Input goal-teams-in"
                  placeholder="Goal Target"
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(e.target.value)}
              />
              <div id="selections-goal">
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
                  <select className="Select" defaultValue="" onChange={e => setGoalType(e.target.value)}>
                      <option disabled={true} value="">
                          SELECT TYPE
                      </option>
                      <option key="CARDIO" value="CST">CONSISTENCY</option>
                      <option key="STRENGTH" value="PR">PR</option>
                  </select>
                  <select className="Select" defaultValue="" onChange={e => setGoalUnit(e.target.value)}>
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
              </div>
              <div id="selections-goal" >
                  {goalType === "CST" && (
                      <>
                      <div class="cst-goal-date">
                          <p>Complete By:</p>
                          <div>
                              <input
                                  className="Input dateSS"
                                  placeholder="MM"
                                  value={endMonth}
                                  onChange={(e) => setEndMonth(e.target.value)}
                                  style={{ width: '25px' }}
                              />
                              <input
                                  className="Input dateSS"
                                  placeholder="DD"
                                  value={endDay}
                                  onChange={(e) => setEndDay(e.target.value)}
                                  style={{ width: '25px' }}
                              />
                              <input
                                  className="Input dateSS"
                                  placeholder="YYYY"
                                  value={endYear}
                                  onChange={(e) => setEndYear(e.target.value)}
                                  style={{ width: '40px' }}
                              />
                          </div>
                          
                      </div>
                      </>
                  )}
              </div>
          </div>
          <Dialog.Close asChild>
              <button className="Button green" onClick={handleAddGoal}>Add Goal</button>
          </Dialog.Close>
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
