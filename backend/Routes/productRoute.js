const express = require("express");
const routes = express.Router();

const {
    createProduct
} = require("../Controllers/productControllers");

routes.post("/create" , createProduct);


module.exports =routes;