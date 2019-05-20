const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
var JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;
const {
  JWT_SECRET
} = require('../config/config');
const opts = {
  secretOrKey: JWT_SECRET,
  passReqToCallback: true,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};
const UserRepository = new (require('../repositories/UserRepository'))();

/**
 * @typedef {import('../routes/auth').User} User
 */

/** @type {User[]} */
let users = [];

const strategyOptions = {
  passwordField: 'password',
  usernameField: 'email',
  passReqToCallback: true
};

passport.use('register', new LocalStrategy(strategyOptions,

  async function (req, username, password, done) {
    /** @type {User} */
    let res = req.res;
    let user = req.body;
    if (user.password !== user.passwordConfirm) {
      return res.status(401).send('passwords do not match');
    } else if (user.password.length < 8) {
      return res.status(401).send('Passwort too short (at least 8 characters)');
    } else if (UserRepository.getByEmail(username)) {
      return res.status(401).send('Username already taken').end();
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    user.password = hash;

    UserRepository.add(user);

    done(null, user);
  }
));

passport.use('login', new LocalStrategy(strategyOptions,

  async function (req, username, password, done) {
    /** @type {User} */
    let res = req.res;
    let user = UserRepository.getByEmail(username);

    if (user === undefined) {
      return res.status(401).send('Cannot find user with name "' + req.body.email + '"').end();
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).send("Wrong password or Email").end();
    }

    done(null, user);
  }
));

passport.use(new JwtStrategy(opts, function (req, jwt_payload, done) {
  let res = req.res;
  let user = UserRepository.get(Number(jwt_payload.sub));

  if (user === undefined) {
    return res.status(401).send("Wrong password or Email").end();
  }

  return done(null, user);
}));