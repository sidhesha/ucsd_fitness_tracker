const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../database/models/user');

// Define Google login strategy
module.exports = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `/api/login/google`,
    scope: [ 'profile', 'email' ]
  },
  /*
  This function maps Google profiles to users in the database:
  - if user exists, call the callback with user
  - if user does not exist, create and call the callback with user
  - if credentials are not valid (banned, etc), call the callback with err
  * */
  async function(accessToken, refreshToken, profile, cb) {
    try {
      let user = await User.findOne({googleId: profile.id});
      if (user) { // User exists in database
        cb(null, user)
      } else { // Otherwise, create a new database entry for the user
        user = await User.create({
          googleId: profile.id,
          fullName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value, // This is an array for some reason
          email: profile.emails[0].value  // This is also an array for some reason
        })
        cb(null, user)
      }
    } catch (err) {
      cb(err)
    }
  }
);
