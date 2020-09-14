const db = require("./connection");

module.exports = {
    add
};

function add(user) {
    return db("users")
        .insert(user);
}