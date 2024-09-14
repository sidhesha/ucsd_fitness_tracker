const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userProfileSchema = new Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number, 
    default: 18,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    default: 'Other',
    required: true,
  },
  fitnessGoal: {
    type: String,
    enum: ['bulk', 'cut', 'tone'],
    default: 'tone',
    required: true,
  },
  workoutDay: {
    type: Number, 
    default: 1,
    required: true,
    validate: {
      validator: (v) => v >= 1 && v <= 7,
      message: "workoutDay must be between 1 and 7",
    },
  }
});

module.exports = mongoose.model('User', userProfileSchema);
