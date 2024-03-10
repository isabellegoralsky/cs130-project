import { useParams } from 'react-router-dom';
import React from 'react';
import { useEffect, useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Avatar from '@radix-ui/react-avatar';
import * as Dialog from '@radix-ui/react-dialog';

export default function OtherProfilePage() {
    const { userId } = useParams(); 
    console.log(userId)
    const [workouts, setWorkouts] = useState([]);
    const [user, setUser] = useState({});
    const [pals, setPals] = useState([]);
    const [isNotPal, setIsNotPal] = useState(true);
    const addPal = () => {
        setIsNotPal(false);
    }
    useEffect(() => { //fetch templates
        console.log(user)
        console.log(userId);
        if (userId !== undefined && userId !== null) {
            const url = `http://localhost:3001/profile/template/${userId}`;

            fetch(url, {
            })
                .then(response => response.json())
                .then(data => {
                    console.log("before transform" + data)
                    console.log(data)
                    transformAndSetWorkouts(data);
                    //setWorkouts(data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            //fetch personalRecords
        }
    }, [user])
    const transformAndSetWorkouts = (data) => {
        const transformedWorkouts = [];

        for (let i = 0; i < data.workoutName.length; i++) {
            let workout = {
                name: data.workoutName[i],
                exercise1: {
                    name: data.exercises[i].exerciseName[0],
                    sets: data.exercises[i].sets[0],
                    reps: data.exercises[i].reps[0],
                },
                exercise2: {
                    name: data.exercises[i].exerciseName[1],
                    sets: data.exercises[i].sets[1],
                    reps: data.exercises[i].reps[1],
                },
                exercise3: {
                    name: data.exercises[i].exerciseName[2],
                    sets: data.exercises[i].sets[2],
                    reps: data.exercises[i].reps[2],
                },
                exercise4: {
                    name: data.exercises[i].exerciseName[3],
                    sets: data.exercises[i].sets[3],
                    reps: data.exercises[i].reps[3],
                },
                exercise5: {
                    name: data.exercises[i].exerciseName[4],
                    sets: data.exercises[i].sets[4],
                    reps: data.exercises[i].reps[4],
                },
                exercise6: {
                    name: data.exercises[i].exerciseName[5],
                    sets: data.exercises[i].sets[5],
                    reps: data.exercises[i].reps[5],
                },
                exercise7: {
                    name: data.exercises[i].exerciseName[6],
                    sets: data.exercises[i].sets[6],
                    reps: data.exercises[i].reps[6],
                },
                exercise8: {
                    name: data.exercises[i].exerciseName[7],
                    sets: data.exercises[i].sets[7],
                    reps: data.exercises[i].reps[7],
                },
                note: data.note[0]
            }
            transformedWorkouts.push(workout);
        }
        // Update the state with the transformed workouts
        setWorkouts(transformedWorkouts);
        console.log("workouts re")
        console.log(transformedWorkouts);
    };
    return (
        <div id="profile-page">
            <Avatar.Root className="AvatarRoot">
                <Avatar.Image
                    className="AvatarImage"
                    src="https://drive.google.com/thumbnail?id=1SQQgzP3d-hCNEA7p9nH4xhb9OO1TCC0G"
                    alt="Avatar Image"
                />
                <Avatar.Fallback className="AvatarFallback" delayMs={600}>
                    Avatar Image Loading...
                </Avatar.Fallback>
            </Avatar.Root>
            {isNotPal && <button id="add-pal-button" onClick={addPal}>Add Pal</button>}
            <h1 id="profile-name">{user.firstName + " " + user.lastName}</h1>
            <Tabs.Root className="TabsRoot" defaultValue="tab1">
                <Tabs.List className="TabsList" aria-label="Profile Tabs">
                    <Tabs.Trigger className="TabsTrigger" value="tab1">
                        Pinned Workouts

                    </Tabs.Trigger>
                    <Tabs.Trigger className="TabsTrigger" value="tab2">
                        Personal Records
                    </Tabs.Trigger>
                    <Tabs.Trigger className="TabsTrigger" value="tab3">
                        My Pals
                    </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content className="TabsContent" id="workout-div" value="tab1">
                        {workouts.map(workout => {
                            return (
                                <div class="pinned-workout">
                                    <p class="pinned-wo-name">{workout.name}</p>
                                    {workout && workout.exercise1 && workout.exercise1.name && workout.exercise1.name !== "" && <p>{workout.exercise1.name} SETS {workout.exercise1.sets} REPS {workout.exercise1.reps} </p>}
                                    {workout && workout.exercise2 && workout.exercise2.name && workout.exercise2.name !== "" && <p>{workout.exercise2.name} SETS {workout.exercise2.sets} REPS {workout.exercise2.reps} </p>}    
                                    {workout && workout.exercise3 && workout.exercise3.name && workout.exercise3.name !== "" && <p>{workout.exercise3.name} SETS {workout.exercise3.sets} REPS {workout.exercise3.reps} </p>}
                                    {workout && workout.exercise4 && workout.exercise4.name && workout.exercise4.name !== "" && <p>{workout.exercise4.name} SETS {workout.exercise4.sets} REPS {workout.exercise4.reps} </p>}
                                    {workout && workout.exercise5 && workout.exercise5.name && workout.exercise5.name !== "" && <p>{workout.exercise5.name} SETS {workout.exercise5.sets} REPS {workout.exercise5.reps} </p>}
                                    {workout && workout.exercise6 && workout.exercise6.name && workout.exercise6.name !== "" && <p>{workout.exercise6.name} SETS {workout.exercise6.sets} REPS {workout.exercise6.reps} </p>}
                                    {workout && workout.exercise7 && workout.exercise7.name && workout.exercise7.name !== "" && <p>{workout.exercise7.name} SETS {workout.exercise7.sets} REPS {workout.exercise7.reps} </p>}
                                    {workout && workout.exercise8 && workout.exercise8.name && workout.exercise8.name !== "" && <p>{workout.exercise8.name} SETS {workout.exercise8.sets} REPS {workout.exercise8.reps} </p>}  
                                    <p>Note: {workout.note}</p>
                                </div>
                            )
                        })}
                </Tabs.Content>
                <Tabs.Content className="TabsContent" value="tab2">
                    <p>Personal Records</p>
                </Tabs.Content>
                <Tabs.Content className="TabsContent" id="pals-content" value="tab3">
                    {pals.map(pal => {
                        return (
                            <div id="pal-names">
                                <p class="pals">{pal}</p>
                            </div>
                        )
                    })}
                </Tabs.Content>
            </Tabs.Root>
        </div>
    )
}