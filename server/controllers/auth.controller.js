// Package imports
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

// ------------- Signup Controller -------------
export const signup = async (req, res) => {
  try {
    // fetch data from req body
    const { fullName, username, password, confirmPassword, gender } = req.body;

    // compare password and confirmPassword
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password do not match" });
    }

    // find user in database
    const user = await User.findOne({ username });

    // check if user already exists
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // generate profile pic
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    // create new user
    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    if (newUser) {
      // generate jwt token
      generateTokenAndSetCookie(newUser._id, res);

      // save user to database
      await newUser.save();

      // send response
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({
        error: "Invalid user data",
      });
    }
  } catch (err) {
    console.log("Error in signup controller", err.message);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

// ------------- Login Controller -------------
export const login = async (req, res) => {
  try {
    // fetch data from req body
    const { username, password } = req.body;

    // find user in database
    const user = await User.findOne({ username });

    // compare input password with hashed password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || "",
    );
    
    // if user not found or password is incorrect
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({
        error: "Invalid username or password",
      });
    }

    // generate jwt token and set cookie
    generateTokenAndSetCookie(user._id, res);

    // send response
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (err) {
    console.log("Error in login controller", err.message);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

// ------------- Logout Controller -------------
export const logout = (req, res) => {
  try {
    // clear cookie
    res
      .status(200)
      .cookie("jwt", "", { maxAge: 0 })
      .json({ message: "User logged out successfully" });

  } catch (err) {
    console.log("Error in logout controller", err.message);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
