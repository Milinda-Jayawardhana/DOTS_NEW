const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authenticate = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

const authorizeUser = (req, res, next) => {
  if (req.user.role !== "user") {
    return res
      .status(403)
      .json({ message: "Role user is not authorized to access this resource" });
  }
  next();
};

const authorizeSupervisor = (req, res, next) => {
  if (req.user.role !== "supervisor") {
    return res
      .status(403)
      .json({
        message: "Role supervisor is not authorized to access this resource",
      });
  }
  next();
};

const authorizeMainAdmin = (req, res, next) => {
  if (req.user.role !== "mainadmin") {
    return res
      .status(403)
      .json({
        message: "Role mainadmin is not authorized to access this resource",
      });
  }
  next();
};

module.exports = {
  authenticate,
  authorizeUser,
  authorizeSupervisor,
  authorizeMainAdmin,
};
