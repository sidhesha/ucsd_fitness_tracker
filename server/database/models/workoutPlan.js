const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema({
  initialized: {
    type: Boolean,
    default: false,
  },
  name: { type: String, required: true },
  goal: { type: String, enum: ['bulk', 'cut', 'tone'], required: true },
  days: [
    {
      dayNumber: { type: Number, required: true },
      exercises: [
        {
          exerciseName: { type: String, required: true },
          sets: { type: Number, required: true },
          reps: { type: Number, required: true },
          link: {type: String, required: false},
        }
      ],
    }
  ],
});

const WorkoutPlan = mongoose.model('WorkoutPlan', workoutPlanSchema);

module.exports = WorkoutPlan;
