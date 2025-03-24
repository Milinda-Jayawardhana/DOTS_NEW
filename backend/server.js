require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const registerRoute = require("./Route/Register");
const bodyParser = require("body-parser");
const Product = require("./Model/productModel");
const cors = require("cors");
const createAdminAccount = require("./Scripts/Admin");
const loginRoute = require("./Route/Login");
const userRoute = require("./Route/User");

const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

//

// Use routes
app.use("/user", registerRoute); // registration-related routes
app.use("/auth", loginRoute); // login-related routes
app.use("/api", userRoute); // user-related routes


createAdminAccount();

mongoose
  .connect(process.env.DATABASE_CONNECTION_URL)
  .then(() => {
    app.listen(3000, () => {
      console.log("API app running on port 3000");
    });
    console.log("Connected to the MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error); // Log the error
  });

