const WorkoutPlan = require('../database/models/workoutPlan');

const hardcodedWorkoutPlans = [
  {
    name: "Bulk Plan",
    goal: "bulk",
    days: [
      {
        dayNumber: 1,
        exercises: [
          { exerciseName: "Squats", sets: 4, reps: 6, link:"https://www.youtube.com/embed/tVB1q8zkP3o" },
          { exerciseName: "Romanian Deadlifts", sets: 3, reps: 8, link:"https://www.youtube.com/embed/e1pFg9Rz55k" },
          { exerciseName: "Leg Press", sets: 3, reps: 10, link:"https://www.youtube.com/embed/3R0SOJ3alTA" },
          { exerciseName: "Calf Raises", sets: 3, reps: 15, link:"https://www.youtube.com/embed/wxwY7GXxL4k" },
          { exerciseName: "Plank", sets: 3, reps: 30, link:"https://www.youtube.com/embed/tgbrMdfuGJA" },
          { exerciseName: "Crunches", sets: 3, reps: 15, link:"https://www.youtube.com/embed/YdZakh0Pkwc" },
        ],
      },
      {
        dayNumber: 2,
        exercises: [
          { exerciseName: "Bench Press", sets: 4, reps: 6, link:"https://www.youtube.com/embed/Qjxrp9Hwv_Q" },
          { exerciseName: "Incline Dumbbell Press", sets: 3, reps: 8, link:"https://www.youtube.com/embed/DnV3R4vp3K0" },
          { exerciseName: "Decline Dumbbell Press", sets: 3, reps: 8, link:"https://www.youtube.com/embed/Pf1nDoqx_1A" },
          { exerciseName: "Triceps Pushdowns", sets: 3, reps: 10, link:"https://www.youtube.com/embed/HIKzvHkibWc" },
          { exerciseName: "Overhead Triceps Extensions", sets: 3, reps: 10, link:"https://www.youtube.com/embed/mRozZKkGIfg" },
          { exerciseName: "Dips (assisted if needed)", sets: 3, reps: 10, link:"https://www.youtube.com/embed/4la6BkUBLgo" },
        ],
      },
      {
        dayNumber: 3,
        exercises: [
          {exerciseName: "Rest Day :)", sets:1, reps: 1, link:"https://www.youtube.com/embed/fv3UNwOgN8A"},
        ]
      },
      {
        dayNumber: 4,
        exercises: [
          { exerciseName: "Pull-ups (assisted if needed)", sets: 4, reps: 10, link:"https://www.youtube.com/embed/WXMKjV11lAk" },
          { exerciseName: "Barbell Rows", sets: 3, reps: 8, link:"https://www.youtube.com/embed/-xlBxIMqh3A" },
          { exerciseName: "Seated Cable Rows", sets: 3, reps: 10, link:"https://www.youtube.com/embed/IzoCF_b3cIY" },
          { exerciseName: "Bicep Curls", sets: 3, reps: 10, link:"https://www.youtube.com/embed/3OZ2MT_5r3Q" },
          { exerciseName: "Hammer Curls", sets: 3, reps: 10, link:"https://www.youtube.com/embed/0IAM2YtviQY" },
          { exerciseName: "Face Pulls", sets: 3, reps: 15, link:"https://www.youtube.com/embed/tkLTR4b6cAk" },
        ],
      },
      {
        dayNumber: 5,
        exercises: [
          { exerciseName: "Lateral Raises", sets: 3, reps: 10, link:"https://www.youtube.com/embed/LT1Eo-q58yg" },
          { exerciseName: "Rear Delt Flyes", sets: 3, reps: 10, link:"https://www.youtube.com/embed/WCvRMULhUVU" },
          { exerciseName: "Plank", sets: 3, reps: 30, link:"https://www.youtube.com/embed/tgbrMdfuGJA" },
          { exerciseName: "Crunches", sets: 3, reps: 10, link:"https://www.youtube.com/embed/YdZakh0Pkwc" },
        ],
      },
      {
        dayNumber: 6,
        exercises: [
          {exerciseName: "Rest Day :)", sets:1, reps: 1, link:"https://www.youtube.com/embed/fv3UNwOgN8A"},
        ]
      },
      {
        dayNumber: 7,
        exercises: [
          { exerciseName: "Treadmill", sets: 1, reps: 30, link:"https://www.youtube.com/embed/E1ekxSmqiFg" },
        ],
      },
    ],
  },
  {
    name: "Cut Plan",
    goal: "cut",
    days: [
      {
        dayNumber: 1,
        exercises: [
          { exerciseName: "Squats", sets: 3, reps: 12, link:"https://www.youtube.com/embed/tVB1q8zkP3o"},
          { exerciseName: "Push-ups", sets: 3, reps: 10, link:"https://www.youtube.com/embed/XIHO5t_VBPQ"},
          { exerciseName: "Barbell Rows", sets: 3, reps: 12, link:"https://www.youtube.com/embed/-xlBxIMqh3A"},
          { exerciseName: "Lunges", sets: 3, reps: 10, link:"https://www.youtube.com/embed/Wb8Yr3Nx7dE"},
        ],
      },
      {
        dayNumber: 2,
        exercises: [
          { exerciseName: "Bench Press", sets: 3, reps: 10, link:"https://www.youtube.com/embed/Qjxrp9Hwv_Q"},
          { exerciseName: "Incline Dumbbell Press", sets: 3, reps: 10, link:"https://www.youtube.com/embed/DnV3R4vp3K0"},
          { exerciseName: "Shoulder Press", sets: 3, reps: 10, link:"https://www.youtube.com/embed/0JfYxMRsUCQ"},
          { exerciseName: "Triceps Pushdowns", sets: 3, reps: 12, link:"https://www.youtube.com/embed/HIKzvHkibWc"},
          { exerciseName: "Jump Rope", sets: 3, reps: 50, link:"https://www.youtube.com/embed/hhsvpAHuVOc"},
        ],
      },
      {
        dayNumber: 3,
        exercises: [
          {exerciseName: "Rest Day :)", sets:1, reps: 1, link:"https://www.youtube.com/embed/fv3UNwOgN8A"},
        ],
      },
      {
        dayNumber: 4,
        exercises: [
          { exerciseName: "Pull-ups (assisted if needed)", sets: 3, reps: 10, link:"https://www.youtube.com/embed/WXMKjV11lAk"},
          { exerciseName: "Barbell Rows", sets: 3, reps: 10, link:"https://www.youtube.com/embed/-xlBxIMqh3A"},
          { exerciseName: "Seated Cable Rows", sets: 3, reps: 12, link:"https://www.youtube.com/embed/IzoCF_b3cIY"},
          { exerciseName: "Bicep Curls", sets: 3, reps: 12, link:"https://www.youtube.com/embed/3OZ2MT_5r3Q"},
          { exerciseName: "Burpees", sets: 3, reps: 10, link:"https://www.youtube.com/embed/sKE4ScobkBA"},
        ],
      },
      {
        dayNumber: 5,
        exercises: [
          { exerciseName: "Squats", sets: 3, reps: 15, link:"https://www.youtube.com/embed/tVB1q8zkP3o"},
          { exerciseName: "Romanian Deadlifts", sets: 3, reps: 12, link:"https://www.youtube.com/embed/e1pFg9Rz55k"},
          { exerciseName: "Bulgarian Split Squats", sets: 3, reps: 10, link:"https://www.youtube.com/embed/UJWLxHAYxx4"},
          { exerciseName: "Calf Raises", sets: 3, reps: 15, link:"https://www.youtube.com/embed/wxwY7GXxL4k"},
          { exerciseName: "Plank", sets: 3, reps: 30, link:"https://www.youtube.com/embed/tgbrMdfuGJA"},
        ],
      },
      {
        dayNumber: 6,
        exercises: [
          {exerciseName: "Rest Day :)", sets:1, reps: 1, link:"https://www.youtube.com/embed/fv3UNwOgN8A"},
        ],
      },
      {
        dayNumber: 7,
        exercises: [
          { exerciseName: "Treadmill", sets: 1, reps: 30, link:"https://www.youtube.com/embed/E1ekxSmqiFg" },
        ],
      },
    ],
  },
  {
    name: "Tone Plan",
    goal: "tone",
    days: [
      {
        dayNumber: 1,
        exercises: [
          { exerciseName: "Squats", sets: 3, reps: 10, link:"https://www.youtube.com/embed/tVB1q8zkP3o" },
          { exerciseName: "Lunges", sets: 3, reps: 10, link:"https://www.youtube.com/embed/Wb8Yr3Nx7dE" },
          { exerciseName: "Romanian Deadlifts", sets: 3, reps: 10, link:"https://www.youtube.com/embed/e1pFg9Rz55k" },
          { exerciseName: "Calf Raises", sets: 3, reps: 15, link:"https://www.youtube.com/embed/wxwY7GXxL4k" },
          { exerciseName: "Plank", sets: 3, reps: 30, link:"https://www.youtube.com/embed/tgbrMdfuGJA"},
          { exerciseName: "Russian Twists", sets: 3, reps: 15, link:"https://www.youtube.com/embed/Nl-txzo-7WQ"},
        ],
      },
      {
        dayNumber: 2,
        exercises: [
          { exerciseName: "Bench Press", sets: 3, reps: 8, link:"https://www.youtube.com/embed/Qjxrp9Hwv_Q" },
          { exerciseName: "Incline Dumbbell Press", sets: 3, reps: 8, link:"https://www.youtube.com/embed/DnV3R4vp3K0" },
          { exerciseName: "Push-ups", sets: 3, reps: 15, link:"https://www.youtube.com/embed/XIHO5t_VBPQ" },
          { exerciseName: "Triceps Pushdowns", sets: 3, reps: 12, link:"https://www.youtube.com/embed/HIKzvHkibWc" },
          { exerciseName: "Overhead Triceps Extensions", sets: 3, reps: 12, link:"https://www.youtube.com/embed/mRozZKkGIfg" },
        ],
      },
      {
        dayNumber: 3,
        exercises: [
          {exerciseName: "Rest Day :)", sets:1, reps: 1, link:"https://www.youtube.com/embed/fv3UNwOgN8A"},
        ],
      },
      {
        dayNumber: 4,
        exercises: [
          { exerciseName: "Pull-ups (assisted if needed)", sets: 3, reps: 10, link:"https://www.youtube.com/embed/WXMKjV11lAk" },
          { exerciseName: "Barbell Rows", sets: 3, reps: 8, link:"https://www.youtube.com/embed/-xlBxIMqh3A" },
          { exerciseName: "Seated Cable Rows", sets: 3, reps: 10, link:"https://www.youtube.com/embed/IzoCF_b3cIY" },
          { exerciseName: "Bicep Curls", sets: 3, reps: 12, link:"https://www.youtube.com/embed/3OZ2MT_5r3Q" },
          { exerciseName: "Hammer Curls", sets: 3, reps: 12, link:"https://www.youtube.com/embed/0IAM2YtviQY" },
        ],
      },
      {
        dayNumber: 5,
        exercises: [
          { exerciseName: "Squats", sets: 3, reps: 12, link:"https://www.youtube.com/embed/tVB1q8zkP3o" },
          { exerciseName: "Bulgarian Split Squats", sets: 3, reps: 10, link:"https://www.youtube.com/embed/UJWLxHAYxx4"},
          { exerciseName: "Glute Bridges", sets: 3, reps: 15, link:"https://www.youtube.com/embed/MqQlfjQOmHA" },
          { exerciseName: "Hip Thrusts", sets: 3, reps: 10, link:"https://www.youtube.com/embed/Fk1OfkMmVt4" },
          { exerciseName: "Jump Rope", sets: 3, reps: 50, link:"https://www.youtube.com/embed/hhsvpAHuVOc"},
        ],
      },
      {
        dayNumber: 6,
        exercises: [
          {exerciseName: "Rest Day :)", sets:1, reps: 1, link:"https://www.youtube.com/embed/fv3UNwOgN8A"},
        ],
      },
      {
        dayNumber: 7,
        exercises: [
          { exerciseName: "Treadmill", sets: 1, reps: 30, link:"https://www.youtube.com/embed/E1ekxSmqiFg" },
        ],
      },
    ],
  },  
  ];

async function initializeWorkoutPlans() {
  try {
    const isInitialized = await WorkoutPlan.exists({ initialized: true });
    if (!isInitialized) {
      const savedWorkoutPlans = await WorkoutPlan.insertMany(hardcodedWorkoutPlans);
      await WorkoutPlan.updateMany({}, { $set: { initialized: true } });
      return savedWorkoutPlans;
    } else {
      return { message: "Workout plans already initialized" }; 
    }
  } catch (error) {
    throw error;
  }

}
    
module.exports = initializeWorkoutPlans;
