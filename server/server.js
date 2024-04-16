// Package imports
import express from 'express';
import { configDotenv } from 'dotenv';
import cookieParser from 'cookie-parser';
// import cors from "cors";

// Custom imports
import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js';
import dbConnect from './db/dbConnet.js';
import { app, server } from './socket/socket.js';

// Configurations
// configDotenv();

// Variables

const port = process.env.PORT || 3000;

// Middlewares
// app.use(cors());
app.use(cookieParser()); // parse incoming request with cookies from req.cookies
app.use(express.json()); // parse incoming request with JSON payloads from req.body
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Base route
app.get("/", (req, res) => {
    res.send("Hello World");
});

// Server
server.listen(port, () => {
    dbConnect();
    console.log(`Server is running on port http://localhost:${port}`);
})