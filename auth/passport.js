const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use('register', new LocalStrategy({
    passwordField: 'password',
    usernameField: 'email',
    passReqToCallback: true
  },

  function (req, username, password, done) {
    console.log(username);
    console.log(password);

    done(null, username);

    // User.findOne({
    //   username: username
    // }, function (err, user) {
    //   if (err) {
    //     return done(err);
    //   }
    //   if (!user) {
    //     return done(null, false);
    //   }
    //   if (!user.verifyPassword(password)) {
    //     return done(null, false);
    //   }
    //   return done(null, user);
    // });
  }
));