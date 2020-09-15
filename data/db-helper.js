const db = require("./connection");

module.exports = {
    register,
    findUser,
    getUsers
};

function register(user) {
    return db("users")
        .insert(user);
}

function findUser(username) {
    return db("users")
        .where({ username })
        .first();
}

function getUsers() {
    return db("users");
}