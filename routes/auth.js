const router = require('express').Router();
const passport = require('passport');
require('../auth/passport');

/**
 * @typedef {Object} User
 * @property {string} email
 * @property {string} password
 * @property {string} passwordConfirm
 * @property {string} displayName
 */

router
    .post('/register', passport.authenticate('register', {session: false}), (req, res) => {
        /** @type {User} */
        let user = req.user;
        res.json(req.user);
        res.send('Not implemented');
    })
    .post('/login', (req, res) => {
        res.send('Not implemented');
    });

module.exports = router;