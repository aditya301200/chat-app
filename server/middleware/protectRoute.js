// Package imports
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
  try {
    // fetch token from cookies
    const token = req.cookies.jwt;
    // console.log(token)

    // if no token, send 401 status
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // if token is invalid, send 401 status
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    // find user by id and exclude password
    const user = await User.findById(decoded.userId).select("-password"); // this userId is the one we set in generateToken.js
    // console.log("user: ", user);
    // send user to req.user
    req.user = user;
    // console.log(req.user._id);
    // req.user = Object;

    // call next middleware
    next();
  } catch (error) {
    console.log("Error in protect route middleware", error.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default protectRoute;
