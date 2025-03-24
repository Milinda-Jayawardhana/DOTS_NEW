const User = require("../Model/Register")

async function getUser(){
    const users = await User.find({});
    return users;
}

module.exports = {getUser};