import http from "http";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

// API CORS
app.use(cors({
  origin: "https://echogram-vn2.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

const server = http.createServer(app);

// Socket.io CORS
const io = new Server(server, {
  cors: {
    origin: "https://echogram-vn2.vercel.app",
    credentials: true,
    methods: ["GET", "POST"],
  },
  transports: ['websocket', 'polling'], 
});

const userSocketMap = {};

export const getSocketId = (receiverId) => userSocketMap[receiverId];

io.on("connection", (socket) => {
  const userId = socket.handshake.query?.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };

