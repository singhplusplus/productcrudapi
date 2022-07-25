const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const UserModel = require('./../models/user.js');

// Auth middleware
passport.use(
  new localStrategy(
    {usernameField: 'email'},
    (username, password, done) => {
      UserModel.findOne(
        {email: username},
        (err, user) => {
          if(err)
            return done(err);
          else if(!user)
            return done(null, false, {message: "Email is not registered"});
          else if(!user.verifyPassword(password))
            return done(null, false, {message: "Password is incorrect"});
          else
            return done(null, user);
        }
      )
    }
  )
);
