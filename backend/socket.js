import http from "http";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

// Normal API CORS setup
app.use(
  cors({
    origin: "https://echogram-vn2.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const server = http.createServer(app);

// Socket.io CORS setup
const io = new Server(server, {
  cors: {
    origin: "https://echogram-vn2.vercel.app",
    methods: ["GET", "POST"],
    credentials: true, 
  },
});

const userSocketMap = {};

export const getSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
