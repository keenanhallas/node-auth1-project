const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bcrypt = require("bcryptjs");

//no routers needed probably

const db = require("../data/db-helper");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
    res.status(200).send("<h1>Authentication Practice</h1>");
});

server.post("/register", (req, res) => {
    const user = req.body;

    const rounds = process.env.BCRYPT_ROUNDS || 4;
    const hash = bcrypt.hashSync(user.password, rounds);

    user.password = hash;

    db.add(user)
        .then(response => {
            res.status(201).json({ message: "User registered" });
        })
        .catch(err => {
            res.status(500).json({ message: "User couldn't be added" });
        });
})

server.post("/login", (req, res) => {

})

server.get("/users", (req, res) => {

})

module.exports = server;