require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const registerRoute = require("./Route/Register");
const bodyParser = require("body-parser");
const cors = require("cors");
const createAdminAccount = require("./Scripts/Admin");
const loginRoute = require("./Route/Login");
const userRoute = require("./Route/User");
const tcolorsRoute = require("./Route/Tcolors");
const tsizesRoute = require("./Route/Tsizes");
const tmaterialsRoute = require("./Route/Tmaterials");
const tcountRoute = require("./Route/Tcount");
const contactRoute = require("./Route/contactUs");
const ttypeRoute = require("./Route/Ttype");
const makeOrderRoute = require("./Route/preorderRoute");
const statsRoute = require("./Route/Stats");
//const productRoute = require("./Routes/productRoute");



const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Import routes

app.use("/user", registerRoute); // registration-related routes
app.use("/auth", loginRoute); // login-related routes
app.use("/api", userRoute); // user-related routes
app.use("/api", tcolorsRoute); // color-related routes
app.use("/api", tsizesRoute); // color-related routes
app.use("/api", tmaterialsRoute); // color-related routes
app.use("/api", tcountRoute); // color-related routes
app.use("/api", contactRoute); // color-related routes
app.use("/api", ttypeRoute); // color-related routes
app.use("/api", makeOrderRoute); // color-related routes
app.use("/api", statsRoute); // type-related routes

//app.use("/product", productRoute);

// Initialize admin account
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
    console.log("Error:",error);
  });
