// TeamPage.js
import React from 'react';
import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
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

const FeedPage = ({}) => {
  const [posts, setPosts] = useState([
    {
      title: 'example',
      name: 'Dillon Go',
      description: 'example description',
      date: '2021-10-10',
      exercises: [
        {
          name: 'dumbbell curls',
          sets: '3',
          reps: '10',
          weight: '20'
        }
      ]
    }

  ]);


  useEffect(() => {
    
  }, [posts]);

  

  return (
    <div className="feed-page">
    <h1>Feed Page</h1>
    <Dialog.Root class="pals-div">
                        <Dialog.Trigger asChild>
                            <button className="" class="">
                                <img class="add-pal-img" src="https://drive.google.com/thumbnail?id=1EqwyGYxBns9dZixaFfKm549nYskLIMWw" alt="pin a workout" />
                            </button>
                        </Dialog.Trigger>
                        <Dialog.Portal>
                            <Dialog.Overlay className="DialogOverlay" >
                                <Dialog.Content className="DialogContent" class="adding">
                                    <Dialog.Title className="DialogTitle">Post</Dialog.Title>
                                    <PostModal />
                                </Dialog.Content>
                            </Dialog.Overlay>
                        </Dialog.Portal>
                       
                    </Dialog.Root>
        {posts.map((post, index) => ( 
          <div className="feed-post" key={index}>
            <h1>{post.title}</h1>
            <h2>{post.name}</h2>
            <p>{post.description}</p>
            <p>{post.date}</p>
            {post.exercises.map((exercise, index) => (
              <div key={index}>
                <p>{exercise.name} {exercise.sets} {exercise.reps} {exercise.weight}</p>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

export default FeedPage;


const PostModal = () => {
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [exercises, setExercises] = useState([{ name: '', sets: '', reps: '', notes: '' }]);

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

  const savePost = async () => {
    const post = {
      title: postTitle,
      description: postDescription,
      exercises: exercises.map(exercise => ({
        name: exercise.name || undefined,
        reps: exercise.reps ? parseInt(exercise.reps, 10) : 0,
        sets: exercise.sets ? parseInt(exercise.sets, 10) : 0,
        notes: exercise.notes || undefined
      })).filter(exercise => exercise.name) 
    };

    console.log(post);
  };

  return (
    <div>
      <input
        className="Input"
        placeholder="Post Title"
        value={postTitle}
        onChange={(e) => setPostTitle(e.target.value)}
      />
      <textarea
        className="Input"
        placeholder="Post Description"
        value={postDescription}
        onChange={(e) => setPostDescription(e.target.value)}
      />
      {exercises.map((exercise, index) => (
        <ExerciseInput
          key={index}
          exerciseList={exerciseList} // Ensure this is passed down or defined within ExerciseInput
          exercise={exercise}
          setExercise={(data) => setExerciseData(index, data)}
        />
      ))}
      <button className="Button-add" onClick={addExercise}>Add Exercise</button>
      <Dialog.Close asChild>
        <button className="Button green" onClick={savePost}>Save Post</button>
      </Dialog.Close>
    </div>
  );
};




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
