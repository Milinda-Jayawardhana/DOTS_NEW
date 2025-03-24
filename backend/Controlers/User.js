const userService = require("../Services/User")

async function getUsers(req, res){
    try{
        const users = await userService.getUser();
        res.json(users);
    }catch(error){
        res.status(500).json({message: error})
    }
}

module.exports = {getUsers};