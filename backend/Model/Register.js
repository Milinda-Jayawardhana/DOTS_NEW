const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ADMIN_EMAIL = "admin@gmail.com"; // Replace with the actual admin email

const userRegister = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure email uniqueness
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'viewer'], // Renamed 'customer' to 'viewer' for consistency
        default: function() {
            return this.email === ADMIN_EMAIL ? 'admin' : 'viewer';
        }
    }
});

module.exports = mongoose.model("User", userRegister);
