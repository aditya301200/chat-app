// Package imports
import express from 'express';
import { login, logout, signup } from '../controllers/auth.controller.js';

// Variables
const router = express.Router();

// Routes
router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

export default router;