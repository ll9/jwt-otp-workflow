const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('../auth/passport');
const uuidv4 = require('uuid/v4');

const {
    JWT_SECRET
} = require('../config/config');

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} email
 * @property {string} password
 * @property {string} passwordConfirm
 * @property {string} displayName
 */

/**
 * @typedef {Object} Jwt
 * @property {string} id
 * @property {string} value
 * @property {bool} revoked
 */

let jwts = [];

router
    .post('/register', passport.authenticate('register', {
        session: false
    }), (req, res) => {
        /** @type {User} */
        let user = req.user;
        let jwtId = uuidv4();
        /** @type {Jwt} */
        let token = {};
        token.value = jwt.sign({}, JWT_SECRET, {
            jwtid: jwtId,
            subject: user.id.toString()
        });
        token.id = jwtId;
        token.revoked = false;
        jwts.push(token);

        res.send(token.value);
    })
    .post('/login', passport.authenticate('login', {
        session: false
    }), (req, res) => {
        /** @type {User} */
        let user = req.user;
        let jwtId = uuidv4();
        /** @type {Jwt} */
        let token = {};
        token.value = jwt.sign({}, JWT_SECRET, {
            jwtid: jwtId,
            subject: user.id.toString()
        });
        token.id = jwtId;
        token.revoked = false;
        jwts.push(token);

        res.send(token.value);
    })
    .get('/endpoint', passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        res.json(req.user);
    })

module.exports = {
    router,
}