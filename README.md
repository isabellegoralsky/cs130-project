# Welcome to GymPals!

## What is GymPals? 
GymPals is a workout application for individuals to keep track of their progress, set goals, and view the history of their workouts. They can also view other people's templates, join teams to communicate, and set team goals to make sure everyone is on track to getting fit. Because motivation to workout consistently can be hard, GymPals is here to fix that problem. 

## Why GymPals?
Maintaining one’s health through regular exercise is a priority for many, but can be
difficult to achieve for beginners and those that struggle with consistency. To address the unmet
need for motivation and accountability in individuals seeking to maintain an active lifestyle, we
propose the development of a fitness-oriented web application. This application will aim to help
users achieve their fitness goals by addressing the following issues:

(1) People may struggle with maintaining motivation to consistently work out.

(2) People struggle to visualize their fitness goals and the progress they have made toward
them.

(3) People may feel bored of their routines, or unsure of how to build a routine for
themselves.

# Getting Started
To start running GymPals locally, here are the steps to follow. At the bottom, you will see the link to our deployed site. 

## Build and Development
To run GymPals locally, you will need to clone the [repository](https://github.com/isabellegoralsky/cs130-project) to your local machine. To do so, go to the directory you would like to place it in and run this command:

``` 
git clone https://github.com/isabellegoralsky/cs130-project.git
```

> Note: You must have npm installed to move on. 

Guide to the server directory and add a .env file. This file should look something like this: 
``` 
DBConnect = [MongoDB database]
TokenSecret = [Secret for token encryption and decryption]
``` 

You must install all the packages needed to run our app. First, guide to the client directory and install dependencies. You can do so by running these commands:

``` 
cd client
npm install
``` 

Then guide to the server directory and install dependencies. You can do so by running these commands: 

``` 
cd server
npm install
``` 

You must start the server in both of these directories by guiding to both server and client directories and running this command: 
``` 
npm start
``` 

After completing all these steps, you should be running locally. 
For the deployed website, please go here: [GymPals link](http://codede-appli-fvdybbpwqa6p-642374602.us-east-1.elb.amazonaws.com:8080/)

# User Manual
Here is a link to how to use our application: [User Manual](https://github.com/isabellegoralsky/cs130-project/wiki/User-Manual)
