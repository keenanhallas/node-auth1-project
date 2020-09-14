const express = require("express");
const helmet = require("helmet");

//no routers needed

const server = express();

server.use(helmet());
server.use(express.json());

server.get("/", (req, res) => {
    res.status(200).send("<h1>Authentication Practice</h1>");
});

module.exports = server;