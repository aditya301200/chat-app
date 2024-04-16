import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}
const userSocketMap = {}; //{userId: socketId}

io.on("connection", (socket) => {
  // console.log("A user connected: ", socket.id);
  const {userId} = socket.handshake.query;
  if(userId != undefined){
    userSocketMap[userId] = socket.id;
  }

  // socket.emit() is used to send events. can be both on the server and client side
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // socket.on() is used to listen for events. can be both on the server and client side
  socket.on("disconnect", () => {
    // console.log("A user disconnected: ", socket.id);

    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
