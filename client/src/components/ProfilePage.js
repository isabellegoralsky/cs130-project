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
    const [currPalName, setCurrPalName] = useState("");
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
    }]);
    useEffect(() => {

        fetch('/api/user')
            .then(response => response.json())
            .then(data => {
                setUser(data);
            });

        //fetch myPals

        //fetch pinnedWorkoutsf
        //fetch personalRecords
    })

    const addPal = () => {
        console.log(currPalName)
        //send currPalName to backend
        setPals([...pals, currPalName])
    }

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
                                <img class="add-pal-img" src="https://drive.google.com/thumbnail?id=1EqwyGYxBns9dZixaFfKm549nYskLIMWw" alt="pin a workout"/>
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
                        { workouts.map(workout => {
                            return (
                                <div class="pinned-workout">
                                    <p class="pinned-wo-name">{workout.name}</p>
                                        <p>{workout.exercise1.name} SETS {workout.exercise1.sets} REPS {workout.exercise1.reps} </p>
                                            {workout.exercise1.notes !== "" && <p>Note: {workout.exercise1.notes}</p>}
                                        <p>{workout.exercise2.name} SETS {workout.exercise2.sets} REPS {workout.exercise2.reps} </p>
                                            {workout.exercise2.notes !== "" && <p>Note: {workout.exercise2.notes}</p>}
                                </div>
                            )
                        })}
                    </Dialog.Root>
                </Tabs.Content>
                <Tabs.Content className="TabsContent" value="tab2">
                    <p>Personal Records</p>
                </Tabs.Content>
                <Tabs.Content className="TabsContent" id="pals-content" value="tab3">
                    <Dialog.Root>
                        <Dialog.Trigger asChild>
                            <button className="IconButton" class="add-pals" aria-label="Update dimensions">
                                <img class="add-pal-img" src="https://drive.google.com/thumbnail?id=1EqwyGYxBns9dZixaFfKm549nYskLIMWw" alt="add a pal"/>
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
    <div style={{ display: 'flex', marginTop: 10, marginBottom: 15, alignItems: 'flex-start'}}>
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
            style={{marginBottom: 5}}
            value={exercise.sets}
            onChange={e => setExercise({ ...exercise, sets: e.target.value })}
        />
        <input
            className="Input"
            placeholder="# Reps"
            style={{marginBottom: 5}}
            value={exercise.reps}
            onChange={e => setExercise({ ...exercise, reps: e.target.value })}
        />
        <input
            className="Input"
            placeholder="Notes"
            style={{marginBottom: 5}}
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
            setExercises([...exercises, { name: '', sets: '', reps: '', notes:'' }]);
        }
    };

    const setExerciseData = (index, data) => {
        const newExercises = [...exercises];
        newExercises[index] = data;
        setExercises(newExercises);
    };

    const saveNewWorkout = () => {
        const data = {
            workoutName,
            exercises: exercises.map(exercise => ({
                exerciseName: exercise.name || undefined,
                reps: exercise.reps ? parseInt(exercise.reps, 10) : 0,
                sets: exercise.sets ? parseInt(exercise.sets, 10) : 0,
                notes: exercise.notes || undefined
            })).concat(Array(8 - exercises.length).fill({
                exerciseName: undefined,
                reps: 0,
                sets: 0,
                notes: ""
            }))
        };
        console.log(data);
        return;

        // Send data to the backend
        fetch('/api/workout', {
            method: 'POST',
            body: data,
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                // Handle success response
            })
            .catch((error) => {
                console.error('Error:', error);
                // Handle error response
            });
    };

    return (
        <div>
            {/* Component UI elements */}
            <fieldset className="Fieldset">
                <label className="Label" htmlFor="workoutName" style={{display: 'none'}}>
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

