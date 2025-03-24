const bcrypt = require("bcrypt");
const User = require("../Model/Register");
const { generateToken } = require("../Utils/jwtUtils");
const { verifyToken } = require("../Utils/authMiddleware");

const ADMIN_EMAIL = "admin@gmail.com"; // Replace with the actual admin email

async function login(email, password) {
    try {
        // Find user by email
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw new Error("User not found");
        }

        // Check if password is valid
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }

        // Determine the role based on email
        const role = email === ADMIN_EMAIL ? "admin" : "viewer";

        // Generate token including role information
        const token = generateToken({
            id: existingUser._id,
            email: existingUser.email,
            role: role
        });

        return token; // Return role along with token
    } catch (error) {
        console.log("Login error:", error.message);
        throw new Error("Invalid credentials");
    }
}

async function refreshToken(oldToken) {
    try {
        const decodedToken = verifyToken(oldToken);
        const user = await User.findById(decodedToken.id);
        if (!user) {
            throw new Error("User not found");
        }

        // Generate a new token using the existing user role
        const newToken = generateToken({
            id: user._id,
            email: user.email,
            role: decodedToken.role
        });

        return newToken;
    } catch (error) {
        throw new Error("Invalid token");
    }
}

module.exports = {
    login,
    refreshToken
};
