const authService = require("../Services/Login");

async function login(req, res){
    try{
        const {email, password } = req.body;
        const token = await authService.login(email, password)
        res.json({ token:token})
    }catch(error){
        res.status(401).json({message: "Invalied credentials"});
    }
}

async function refreshToken(req, res){
    try{
        const {token} = req.body;
        const newToken = await authService.refreshToken(token)
        res.json({ newToken: newToken})
    }catch(error){
        res.status(401).json({message: "Invalied token"});
    }
}

module.exports = {
    login, refreshToken
}