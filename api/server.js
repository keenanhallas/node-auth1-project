const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const restrict = require("../restricted-middleware");

//no routers needed probably

const db = require("../data/db-helper");

const server = express();

const sessionConfig = {
    name: "best cookie ever",
    secret: "it's chocolate chip", //use env here
    cookie: {
        maxAge: 1000 * 30,
        secure: false, //true in production
        httpOnly: true
    },
    resave: false,
    saveUnitialized: false
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

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
    let { username, password } = req.body;

    db.findUser(req.body.username)
        .then(user => {
            if(user && bcrypt.compareSync(password, user.password)) {
                req.session.user = user;
                res.status(200).json({ Message: `Welcome ${user.username}!` });
            } else {
                res.status(401).json({ message: "Invalid credentials" });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err.message} );
        });
})

server.get("/users", restrict, (req, res) => {
    db.getUsers()
        .then(users => {
            res.status(200).json({ users: users });
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
})

module.exports = server;