// TeamPage.js
import React, { useState, useEffect } from 'react';
import Carousel from './Carousel';
import './Teams.css';

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
        },
        {
          name: 'dumbbell curls',
          sets: '3',
          reps: '10',
          weight: '20'
        },
        {
          name: 'dumbbell curls',
          sets: '3',
          reps: '10',
          weight: '20'
        }
        ,{
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

