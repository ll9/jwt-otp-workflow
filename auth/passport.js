const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
const JWT_SECRET = 'Eo_taLwPB4YAIkrh_nkKKPYewFGu37oQIlxypikjnovEHV_QMkdpnH5goTTnSTzqez87o3mM76ErvuQshxsPmdAVYocPovQAxRplA9TFSHQf_4gBvvwUe7FbVevBu8WObwRmr073kd2bu7NJX0fAOwDc9V1XceVYExsCIBxtn1CyVyTcSPpsb3k2Dgnap0wP77BRDJcPhSvFaHiitO6dtoOPJZyZDSvcQ_tTcegsnVBfoW9H5FC-nN9cAFaqvhV1D8VItS75sj-WcfRTpOyLxk5KVERfYNaXrTcLuTtfJZlylhNS7GXBKdz0w75R3BxPqTrZ52Fh9J6NvrxbZavDUA';
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = JWT_SECRET;
opts.passReqToCallback = true;


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
    } else if (users.find(u => u.email === username)) {
      return res.status(401).send('Username already taken').end();
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    user.password = hash;
    user.id = genId();

    users.push(user);

    done(null, user);
  }
));

passport.use('login', new LocalStrategy(strategyOptions,

  async function (req, username, password, done) {
    /** @type {User} */
    let res = req.res;
    let user = users.find(u => u.email === username);

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

passport.use(new JwtStrategy(opts, function(req, jwt_payload, done) {
  let res = req.res;
  let user = users.find(u => u.id === Number(jwt_payload.sub));

  if (user === undefined) {
    return res.status(401).send("Wrong password or Email").end(); 
  }

  return done(null, user);
}));