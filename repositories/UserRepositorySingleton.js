/**
 * @typedef {import('../routes/auth').User} User
 */

let instance = null;

class UserRepositorySingleton {

    constructor() {
        if (instance) {
            return instance;
        }

        /** @type {User[]} */
        this.users = []
        instance = this;
        return instance;
    }

    genId() {
        if (this.users.length === 0) {
            return 1;
        }

        return Math.max(this.users.map(u => u.id)) + 1;
    }

    get(id) {
        let user = this.users.find(u => u.id === id)

        return user;
    }

    getByEmail(email) {
        let user = this.users.find(u => u.email === email)

        return user;
    }

    /**
     * 
     * @param {User} user 
     */
    add(user) {
        if (!user.id) {
            user.id = this.genId();
        }

        this.users.push(user);
    }
}

module.exports = UserRepositorySingleton;