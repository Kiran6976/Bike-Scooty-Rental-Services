const jwt = require("jsonwebtoken");
const User = require('../models/userSchema');
const Admin = require('../models/adminSchema');

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.jwtoken || req.cookies.jwtAdmin;

    if (!token) {
      return res.status(401).send("Unauthorized: No token provided");
    }

    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

    // First try to find as a User
    let rootUser = await User.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });

    // If not found, try to find as Admin
    if (!rootUser) {
      rootUser = await Admin.findOne({
        _id: verifyToken._id,
        "tokens.token": token,
      });
    }

    if (!rootUser) {
      throw new Error("User/Admin not found");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.status(401).send("Unauthorized: Invalid or expired token");
  }
};

module.exports = authenticate;
