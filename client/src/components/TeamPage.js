// TeamPage.js
import React, { useState, useEffect } from 'react';
import Carousel from './Carousel';
import './Teams.css';

const TeamPage = ({ teams, updates, achievements }) => {
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
        <Carousel items={updates[selectedTeam?.id] || ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']} title="Updates" />
        <Carousel items={achievements[selectedTeam?.id] || ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']} title="Achievements" />
      </div>
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
