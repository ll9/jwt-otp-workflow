const OneTimePassword = require('../models/OneTimePassword');
const uuid4 = require('uuid/v4');

function generatePassword() {
    let length = 8,
        charset = "ACDEFGHIJKMNPQRSTUVWXYZ2345679",
        value = "",
        seperator = 4

    for (var i = 0, n = charset.length; i < length; ++i) {
        if (i % seperator === 0 && i !== 0) {
            value += "-";
        }
        value += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return value;
}

let instance = null;


/**
 * TODO:
 * consume otp (delete on consumption)
 * check if otp expires
 * generate jwt on consumption
 */
class OneTimePasswordRepositorySingleton {
    constructor() {
        if (instance) {
            return instance;
        }

        /** @type {OneTimePassword[]} */
        this.oneTimePasswords = []
        instance = this;

        return instance;
    }

    get(id) {
        let user = this.oneTimePasswords.find(u => u.id === id)

        return user;
    }

    generate(userId) {
        let otp = new OneTimePassword();
        otp.userId = userId;
        otp.id = uuid4();
        otp.expires = new Date(new Date().getTime() + 5 * 60 * 1000).toUTCString();

        while (true) {
            let password = generatePassword();
            if (!this.oneTimePasswords.find(otp => otp.value === password)) {
                otp.value = password;
                this.add(otp);
                return otp;
            }
        }
    }

    /**
     * 
     * @param {User} user 
     */
    add(user) {
        if (!user.id) {
            user.id = uuid4();
        }

        this.oneTimePasswords.push(user);
    }
}

module.exports = OneTimePasswordRepositorySingleton;