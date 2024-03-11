import React from 'react';
import { useEffect, useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Avatar from '@radix-ui/react-avatar';
import * as Dialog from '@radix-ui/react-dialog';
import './ProfilePage.css';

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


export default function ProfilePage() {
    const [user, setUser] = useState({});
    const [pals, setPals] = useState(["Test Pal1", "Test Pal2", "Test Pal3"]);
    const [visibleExercises, setVisibleExercises] = useState(1);
    const [personalRecords, setPersonalRecords] = useState([]);
    const [currPalName, setCurrPalName] = useState("");
    const [imageSrc, setImageSrc] = useState("");
    const [workouts, setWorkouts] = useState([{
        name: "Test Workout",
        exercise1: {
            name: "Deadlift",
            sets: 3,
            reps: 8,
            notes: "Heavy"
        },
        exercise2: {
            name: "Pullup",
            sets: 4,
            reps: 8,
            notes: ""
        },
    },
    ]);
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

    useEffect(() => { //fetch templates
        let userId = user._id;
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

        }
    }, [user])

    useEffect(() => {
        async function fetchPersonalRecords() {
          const userId = user._id;
          if (userId) {
            const url = `http://localhost:3001/personalRecord`; 
      
            try {
              const response = await fetch(url, {
                method: 'GET', 
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include', 
              });
      
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
      
              const data = await response.json();
              console.log("pr");
              console.log(data);
              setPersonalRecords(data);
            } catch (error) {
              console.error('Error:', error);
            }
          }
        }
      
        fetchPersonalRecords();
      }, [user]); 

      useEffect(() => {
        if(user._id === undefined){
            return;
        }
        const url = `http://localhost:3001/profile/${user._id}/profilepage`;
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log("user data is")
                console.log(data)
                setPals(data.followingNames);
                if (data.profilePic && data.profilePic.image && data.profilePic.image.data && data.profilePic.image.data.length > 0) {
                    let imageData = data.profilePic.image

                    const blob = new Blob([new Uint8Array(imageData.data)], { type: imageData.contentType });
                    const imageSrc = URL.createObjectURL(blob);
                    console.log("image src is " + imageSrc)
                    setImageSrc(imageSrc);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, [user])
      


    const transformAndSetWorkouts = (data) => {
        const transformedWorkouts = [];
        if(!data || !data.workoutName || !data.exercises){
            console.log("no data in workouts")
            return;
        }
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

    };

    const addPal = () => {
        console.log("friending " + currPalName)

        //send currPalName to backend
        setPals([...pals, currPalName])
    }

    return (
        <div id="profile-page">
            <Avatar.Root className="AvatarRoot">
                <Avatar.Image
                    className="AvatarImage"
                    src = {imageSrc ? imageSrc : "https://drive.google.com/thumbnail?id=1SQQgzP3d-hCNEA7p9nH4xhb9OO1TCC0G"}
                    alt="Avatar Image"
                />
                <Avatar.Fallback className="AvatarFallback" delayMs={600}>
                    Avatar Image Loading...
                </Avatar.Fallback>
            </Avatar.Root>
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
                    <Dialog.Root class="pals-div">
                        <Dialog.Trigger asChild>
                            <button className="Button violet" class="add-pals">
                                <img class="add-pal-img" src="https://drive.google.com/thumbnail?id=1EqwyGYxBns9dZixaFfKm549nYskLIMWw" alt="pin a workout" />
                            </button>
                        </Dialog.Trigger>
                        <Dialog.Portal>
                            <Dialog.Overlay className="DialogOverlay" >
                                <Dialog.Content className="DialogContent" class="adding">
                                    <Dialog.Title className="DialogTitle">Add workout</Dialog.Title>
                                    <WorkoutModal />
                                </Dialog.Content>
                            </Dialog.Overlay>
                        </Dialog.Portal>
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
                    </Dialog.Root>
                </Tabs.Content>
                <Tabs.Content className="TabsContent" value="tab2">
                    <p>Personal Records</p>
                    {personalRecords.map(record => {
                        return (
                            <div class="pinned-workout">
                                <p class="pinned-wo-name">{record.exerciseName}</p>
                                <p>{record.record} LBS</p>
                            </div>
                        )
                    }
                    )}
                </Tabs.Content>
                <Tabs.Content className="TabsContent" id="pals-content" value="tab3">
                    <Dialog.Root>
                        <Dialog.Trigger asChild>
                            <button className="IconButton" class="add-pals" aria-label="Update dimensions">
                                <img class="add-pal-img" src="https://drive.google.com/thumbnail?id=1EqwyGYxBns9dZixaFfKm549nYskLIMWw" alt="add a pal" />
                            </button>
                        </Dialog.Trigger>
                        <Dialog.Portal>
                            <Dialog.Overlay className="DialogOverlay" >
                                <Dialog.Content className="adding" sideOffset={5}>
                                    <div style={{ gap: 10 }}>
                                        <Dialog.Title className="DialogTitle">Add a pal!</Dialog.Title>
                                        <fieldset className="Fieldset">
                                            <label className="Label" htmlFor="name">
                                                Name
                                            </label>
                                            <input
                                                className="Input"
                                                placeholder="enter pal name..."
                                                defaultValue="enter pal name..."
                                                value={currPalName}
                                                onChange={(e) => setCurrPalName(e.target.value)}
                                            />
                                        </fieldset>


                                    </div>
                                    <div style={{ display: 'flex', marginTop: 15, justifyContent: 'flex-end' }}>
                                        <Dialog.Close asChild>
                                            <button className="Button green" onClick={addPal}>Save</button>
                                        </Dialog.Close>
                                    </div>
                                </Dialog.Content>
                            </Dialog.Overlay>
                        </Dialog.Portal>
                    </Dialog.Root>
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

const ExerciseInput = ({ exerciseList, exercise, setExercise }) => (
    <div style={{ display: 'flex', marginTop: 10, marginBottom: 15, alignItems: 'flex-start' }}>
        <select
            className="Select"
            value={exercise.name}
            onChange={e => setExercise({ ...exercise, name: e.target.value })}
        >
            {exerciseList.map((ex) => (
                <option key={ex} value={ex}>
                    {ex}
                </option>
            ))}
        </select>
        <div class="workout-deets">
            <input
                className="Input"
                placeholder="# Sets"
                style={{ marginBottom: 5 }}
                value={exercise.sets}
                onChange={e => setExercise({ ...exercise, sets: e.target.value })}
            />
            <input
                className="Input"
                placeholder="# Reps"
                style={{ marginBottom: 5 }}
                value={exercise.reps}
                onChange={e => setExercise({ ...exercise, reps: e.target.value })}
            />
            <input
                className="Input"
                placeholder="Notes"
                style={{ marginBottom: 5 }}
                value={exercise.notes}
                onChange={e => setExercise({ ...exercise, notes: e.target.value })}
            />
        </div>
    </div>
);


const WorkoutModal = () => {
    const [workoutName, setWorkoutName] = useState('');
    const [exercises, setExercises] = useState([{ name: '', sets: '', reps: '', notes: 'f' }]);

    const addExercise = () => {
        if (exercises.length < 8) {
            setExercises([...exercises, { name: '', sets: '', reps: '', notes: '' }]);
        }
    };

    const setExerciseData = (index, data) => {
        const newExercises = [...exercises];
        newExercises[index] = data;
        setExercises(newExercises);
    };

    const saveNewWorkout = async () => {
        const data = {
            workoutName: workoutName || undefined,
            exercises: {
                exerciseName: exercises.map(exercise => exercise.name || undefined),
                reps: exercises.map(exercise => exercise.reps || undefined),
                sets: exercises.map(exercise => exercise.sets || undefined),
            }
        };
        console.log(data)
        const url = `http://localhost:3001/profile/addtemplate`;


    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                
            },
            credentials: 'include', // to include the cookie in the request
            body: JSON.stringify(data),
        });

        if (response.ok) {
            console.log("Successfully added to template.");
            const result = await response.json();
            console.log(result); 
        } else {
            const errorResult = await response.text();
            console.error("Failed to add to template:", errorResult);
        }
    } catch (error) {
        console.error("Error sending data to the endpoint:", error);
    }
    };

    return (
        <div>
            {/* Component UI elements */}
            <fieldset className="Fieldset">
                <label className="Label" htmlFor="workoutName" style={{ display: 'none' }}>
                    Workout Name
                </label>
                <input
                    className="Input"
                    id="workoutName"
                    placeholder='Name your workout!'
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                />
            </fieldset>
            {exercises.map((exercise, index) => (
                <ExerciseInput
                    key={index}
                    exerciseList={exerciseList}
                    exercise={exercise}
                    setExercise={(data) => setExerciseData(index, data)}
                />
            ))}
            <div style={{ display: 'flex', marginTop: 15, justifyContent: 'flex-start' }}>
                <button className="Button-add" onClick={addExercise}>add exercise</button>
            </div>
            <div style={{ display: 'flex', marginTop: 10, justifyContent: 'flex-end' }}>
                <Dialog.Close asChild>
                    <button className="Button green" onClick={saveNewWorkout}>Save</button>
                </Dialog.Close>
            </div>
        </div>
    );
};

