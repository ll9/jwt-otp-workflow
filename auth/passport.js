const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

/**
 * @typedef {import('../routes/auth').User} User
 */

 /** @type {User[]} */
 let users = [];

passport.use('register', new LocalStrategy({
    passwordField: 'password',
    usernameField: 'email',
    passReqToCallback: true
  },

  async function (req, username, password, done) {
    /** @type {User} */
    let user = req.body;
    if (user.password !== user.passwordConfirm) {
      return req.res.send(401, 'passwords do not match');
    }
    if (users.find(u => u.email === username)) {
      return req.res.status(401).send('Username already taken').end();
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    console.log(username);
    console.log(password);
    req.body.password = hash;
    req.body.id = 1;

    users.push(req.body);

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