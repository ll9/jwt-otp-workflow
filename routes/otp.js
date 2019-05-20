const router = require('express').Router();
const passport = require('passport');
const UserRepository = new (require('../repositories/UserRepositorySingleton'))();
const OneTimePasswordRepositorySingleton = new (require('../repositories/OneTimePasswordRepositorySingleton'))(); 


router
    .post('/invite/:userId', passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        let userId = req.params.userId;

        if (userId === undefined) {
            res.send(404).end();
        }
        
        let user = UserRepository.get(Number(userId));

        if (user === undefined) {
            return res.status(404).send('User not found').end();
        }

        let otp = OneTimePasswordRepositorySingleton.generate(req.body);
        res.send(otp.value);
    });

module.exports = router;