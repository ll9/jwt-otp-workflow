class OneTimePassword {
    /**
     * 
     * @param {string} id 
     * @param {Date} expires 
     * @param {string} value 
     * @param {number} userId 
     */
    constructor(id, expires, value, userId) {
        this.id = id;
        this.expires = expires;
        this.value = value;
        this.userId = userId;
    }
}

module.exports = OneTimePassword;