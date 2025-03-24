const jwt = require("jsonwebtoken");
const { secretKey } = require("../Configuration/jwtConfig");



    function authenticateToken(req, res, next) {
        const authHeader = req.header("Authorization");
        console.log("Auth Header Received:", authHeader); // Debugging
    
        if (!authHeader) {
            return res.status(401).json({ message: "Unauthorized: Missing Token" });
        }
    
        const [bearer, token] = authHeader.split(" ");
        console.log("Extracted Token:", token); // Debugging
    
        if (bearer !== "Bearer" || !token) {
            return res.status(401).json({ message: "Unauthorized: Invalid token format" });
        }
    
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                console.log("Token verification failed:", err.message);
                return res.status(403).json({ message: "Forbidden: Invalid token" });
            }
    
            req.user = user;
            console.log("Verified User:", user); // Debugging
            next();
        });
    }
    

// Middleware to authorize only admins
function authorizeAdmin(req, res, next) {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden: Admin access only" });
    }
    next(); // Allow admin users to proceed
}



function verifyToken(token) {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        console.error("Token verification failed:", error.message);
        throw new Error("Invalid or expired token");
    }
}


module.exports = { authenticateToken, authorizeAdmin, verifyToken };
