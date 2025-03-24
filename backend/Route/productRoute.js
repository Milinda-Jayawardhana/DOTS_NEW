const express = require("express");
const routes = express.Router();

const {
    createProduct
} = require("../Controlers/productControllers");

routes.post("/create" , createProduct);


module.exports =routes;