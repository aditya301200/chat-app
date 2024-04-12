// Package imports
import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

// Variables
const router = express.Router();

// Routes
router.get("/:id",protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

export default router;