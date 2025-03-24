const User = require("../Model/Register");
const bcrypt = require("bcrypt")

async function createAdminAccount(){
    try{
        const existAdmin = await User.findOne({email:"admin@gmail.com"});
        if(!existAdmin){
            const newadmin = new User({
                email: "admin@gmail.com",
                name: "Admin",
                password: await bcrypt.hash("admin",10),
                role:  "admin"
            })
            await newadmin.save();
            console.log("Admin account created succesfully")
        }else{
            console.log("Admin already exist");
        }
    }catch(error){
        console.error(error.message);
    }
}

module.exports = createAdminAccount;