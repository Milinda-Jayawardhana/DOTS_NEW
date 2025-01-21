const express = require("express");
const routes = express.Router();

const {
    createTshirt
} = require("../Controllers/tShirtController");

routes.post("/create" , createTshirt);


module.exports =routes;