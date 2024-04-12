// Package imports
import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUsersForSideBar } from "../controllers/user.controller.js";

// Variables
const router = express.Router();

// Routes
router.get("/",protectRoute, getUsersForSideBar);

export default router;
