var GoogleStrategy =  require('passport-google-oauth20').Strategy,
  sql =               require('mysql2/promise'),
  user =              require('../models/user.js');

module.exports = function(passport) {
  // Serialize user id
  passport.serializeUser(function(user, cb) {
    cb(null, user.user_id);
  });

  // Deserialise user object using user id
  passport.deserializeUser(async function(userId, cb) {
    try {
      let rows = await user.findUserByUserId(userId);   // attempt to retrieve user object
      if (rows.length == 0){                            // if not found
        return cb(new Error('User not found'));         // return error
      }
      cb(null, rows[0]);                                // if found, return user object
    }
    catch (error) {
      return cb(error);
    }
  });

  // Set up google authentication strategy using passport module
  passport.use(new GoogleStrategy({
    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    callbackURL: 'https://indaba-one.herokuapp.com/auth/google'
  },
  async function(accessToken, refreshToken, profile, cb) {
    // Find user or create new one
    try {
      let rows = await user.findUserByGoogleId(profile.id); // attempt to retrieve user object

      if (rows.length == 0) {                               // if user not found
        let email = profile.emails.find(email => email.verified) || profile.emails[0];
        let googleId = profile.id;
        let displayName = profile.displayName;
        await user.createUser(displayName, email.value, googleId, null);  // add user to database
        rows = await user.findUserByGoogleId(googleId);                   // retrieve new user object
      }
      return cb(null, rows[0]);                             // return user object
    }
    catch(error){
      return cb(error);
    }
  }));
}
