const User = require("../Model/Register");
const bcrypt = require("bcrypt");

async function createUser(userData) {
    const { name, email, password } = userData;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("Email already exists"); // This error will be caught in the controller
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const createdUser = new User({
        name,
        email,
        password: hashedPassword,
        role: 'viewer'
    });

    return await createdUser.save();
}

module.exports = { createUser };
