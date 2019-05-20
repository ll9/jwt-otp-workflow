const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

/**
 * @typedef {import('../routes/auth').User} User
 */

 /** @type {User[]} */
 let users = [];

 function genId(user) {
   if (users.length === 0) {
     return 1;
   }

   return Math.max(users.map(u => u.id)) + 1;
 }

passport.use('register', new LocalStrategy({
    passwordField: 'password',
    usernameField: 'email',
    passReqToCallback: true
  },

  async function (req, username, password, done) {
    /** @type {User} */
    let res = req.res;
    let user = req.body;
    if (user.password !== user.passwordConfirm) {
      return res.status(401).send('passwords do not match');
    }
    if (user.password.length < 8) {
      return res.status(401).send('Passwort too short (at least 8 characters)');
    }
    if (users.find(u => u.email === username)) {
      return res.status(401).send('Username already taken').end();
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    req.body.password = hash;
    req.body.id = genId();

    users.push(req.body);

    done(null, req.body);
  }
));