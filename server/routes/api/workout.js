// routes/api.js
const express = require('express');
const router = express.Router();
const WorkoutPlan = require('../../database/models/workoutPlan');

// Get workout plan for a specific day and goal
router.get('/:goal/:dayNumber', async (req, res) => {
  const { goal, dayNumber } = req.params;

  try {
    const workoutPlan = await WorkoutPlan.findOne({
      goal: goal,
      'days.dayNumber': parseInt(dayNumber),
    });

    if (!workoutPlan) {
      return res.status(404).json({ message: 'Workout plan not found' });
    }

    // Extract the specific day's workout
    const dayWorkout = workoutPlan.days.find(day => day.dayNumber === parseInt(dayNumber));

    res.json({
      goal: workoutPlan.goal,
      day: dayWorkout,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
