const express = require("express");
const routes = express.Router();

const {
    createTshirt
} = require("../Controlers/tShirtController");

routes.post("/create" , createTshirt);


module.exports =routes;