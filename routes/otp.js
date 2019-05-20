const router = require('express').Router();
const passport = require('passport');


router
    .post('/invite', passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        let userId = req.body;

        
    });