import React from 'react';
import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import './FeedPage.css';

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
      title: 'quick back and bi workout',
      name: 'Dillon Go',
      description: '',
      date: '2021-10-10',
      exercises: [
        {
          name: 'Bent-Over Row',
          sets: '3',
          reps: '10',
          weight: '60'
        },
        {
          name: 'Lat Pull-Down',
          sets: '3',
          reps: '10',
          weight: '70'
        },
        {
          name: 'Barbell Curl',
          sets: '3',
          reps: '10',
          weight: '20'
        }
      ]
    },
    {
      title: 'some legs',
      name: 'Darren Huang',
      description: 'a few compound movements',
      date: '2021-10-10',
      exercises: [
        {
          name: 'Deadlift',
          sets: '3',
          reps: '10',
          weight: '135'
        },
        {
          name: 'Squat',
          sets: '4',
          reps: '10',
          weight: '120'
        },
        {
          name: 'Lunges',
          sets: '3',
          reps: '10',
          weight: '110'
        }
      ]
    },
    {
      title: 'misc workout',
      name: 'Sam Rafter',
      description: 'full body random exercises',
      date: '2021-10-10',
      exercises: [
        {
          name: 'Barbell Curl',
          sets: '3',
          reps: '10',
          weight: '20'
        },
        {
          name: 'Lunges',
          sets: '3',
          reps: '10',
          weight: '100'
        },
        {
          name: 'Tricep Dip',
          sets: '3',
          reps: '10',
          weight: '20'
        },
        {
          name: 'Russian Twist',
          sets: '3',
          reps: '12',
          weight: ''
        }
      ]
    }

  ]);


  useEffect(() => {
    
  }, [posts]);

  

  return (
    <div className="feed-page">
      <Dialog.Root class="pals-div">
        <Dialog.Trigger asChild>
          <button className="" class="add-post">
            create a post + </button>
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
        <div class="post-row">
          <h2 class="poster">{post.name}</h2>
          <div className="feed-post" key={index}>
            <h1 class="post-title">{post.title}</h1>
            <p class="post-descript">{post.description}</p>
            {post.exercises.map((exercise, index) => (
              <div key={index}>
                <p class="post-exer">&#x2022; <span class="exer-name">{exercise.name}</span>: {exercise.sets}x{exercise.reps} @ {exercise.weight}lbs</p>
              </div>
            ))}
            <p class='post-date'>{post.date}</p>
          </div>
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
    <div id="feed-page-pop-up">
      <div id="post-deets">
        <input
          style={{marginBottom: '8px'}}
          className="Input"
          placeholder="Post Title"
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
        />
        <input
          style={{marginBottom: '20px'}}
          className="Input"
          placeholder="Post Description"
          value={postDescription}
          onChange={(e) => setPostDescription(e.target.value)}
        />
      </div>
      {exercises.map((exercise, index) => (
        <ExerciseInput
          key={index}
          exerciseList={exerciseList} // Ensure this is passed down or defined within ExerciseInput
          exercise={exercise}
          setExercise={(data) => setExerciseData(index, data)}
        />
      ))}
      <div id="pop-up-buttons">
        <button className="add-workout-pop" onClick={addExercise}>Add Exercise</button>
        <Dialog.Close asChild>
          <button className="Button green" onClick={savePost}>Save Post</button>
        </Dialog.Close>
      </div>
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
