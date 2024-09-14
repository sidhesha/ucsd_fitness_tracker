const express = require('express');
const router = express.Router();
const User = require('../../database/models/user')

/* /api/user/* endpoint controllers */
router.get('/', (req, res) => {
  if (req.user) {
    res.json({user: req.user});
  } else {
    res.status(401);
    res.json({error: "User not logged in"});
  }
});
router.post('/update', async (req, res) => {
  if (!req.user) {
    res.status(401);
    res.json({error: "User not logged in"});
    return;
  }
  if (Object.keys(req.body).length === 0) {
    res.json({user: {}});
    return;
  }
  const invalid = checkProfileInputs(req.body);
  if (invalid) {
    res.status(400);
    res.json({error: `Invalid input: ${invalid}`});
    return;
  }
  try {
    const {age, gender, fitnessGoal} = req.body;
    const result = await User.findOneAndUpdate({googleId: req.user.googleId}, {
      age,
      gender,
      fitnessGoal,
    }, {
      new: true,
      includeResultMetadata: true,
      projection: ["age", "gender", "fitnessGoal"]
    });
    if (result.ok) {
      res.json({user: result.value});
    } else {
      res.status(500);
      res.json({error: "Failed to update"});
    }
  } catch (err) {
    res.status(500);
    res.json({error: `Server error: ${err}`});
  }
});

function checkProfileInputs(data) {
  if (data.age !== undefined && !Number.isInteger(Number(data.age)) || Number(data.age) <= 0) {
    return "Age";
  }
  if (data.gender !== undefined && !/^(Male|Female|Nonbinary|Other)$/i.test(data.gender)) {
    return "Gender";
  }
  if (data.fitnessGoal !== undefined && !/^(bulk|cut|tone)$/i.test(data.fitnessGoal)) {
    return "Fitness Goal";
  }
}

router.post('/updateWorkoutDay', async (req, res) => {
  if (!req.user) {
    res.status(401);
    res.json({error: "User not logged in"});
    return;
  }
  try {
    const { workoutDay } = req.body;
    const userProfile = await User.findOneAndUpdate(
      { googleId: req.user.googleId },
      { workoutDay },
      { new: true, projection: ["workoutDay"] }
    );

    if (userProfile) {
      res.json({ user: userProfile });
    } else {
      res.status(404);
      res.json({ error: "User profile not found" });
    }
  } catch (err) {
    res.status(500);
    res.json({ error: `Server error: ${err}` });
  }
});

module.exports = router;
