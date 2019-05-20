const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

passport.use('register', new LocalStrategy({
    passwordField: 'password',
    usernameField: 'email',
    passReqToCallback: true
  },

  async function (req, username, password, done) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    console.log(username);
    console.log(password);
    req.body.password = hash;

    done(null, req.body);

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