const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('../auth/passport');

const JWT_SECRET = 'Eo_taLwPB4YAIkrh_nkKKPYewFGu37oQIlxypikjnovEHV_QMkdpnH5goTTnSTzqez87o3mM76ErvuQshxsPmdAVYocPovQAxRplA9TFSHQf_4gBvvwUe7FbVevBu8WObwRmr073kd2bu7NJX0fAOwDc9V1XceVYExsCIBxtn1CyVyTcSPpsb3k2Dgnap0wP77BRDJcPhSvFaHiitO6dtoOPJZyZDSvcQ_tTcegsnVBfoW9H5FC-nN9cAFaqvhV1D8VItS75sj-WcfRTpOyLxk5KVERfYNaXrTcLuTtfJZlylhNS7GXBKdz0w75R3BxPqTrZ52Fh9J6NvrxbZavDUA';
/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} email
 * @property {string} password
 * @property {string} passwordConfirm
 * @property {string} displayName
 */

router
    .post('/register', passport.authenticate('register', {session: false}), (req, res) => {
        /** @type {User} */
        let user = req.user;
        let token = jwt.sign({}, JWT_SECRET, {jwtid: 'guid', subject: user.id.toString()});
        res.send(token);
    })
    .post('/login', (req, res) => {
        res.send('Not implemented');
    });

module.exports = router;