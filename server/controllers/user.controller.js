import User from "../models/user.model.js";

export const getUsersForSideBar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filterUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password"); // It will return all users except the logged in user and will not return password field
    res.status(200).json(filterUsers);
  } catch (err) {
    console.log("Error get users for sidebar controller", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
