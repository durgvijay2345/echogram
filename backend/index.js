import express from "express"; 
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import loopRouter from "./routes/loop.route.js";
import storyRouter from "./routes/story.route.js";
import messageRouter from "./routes/message.route.js";
import { app, server } from "./socket.js";

dotenv.config();

const port = process.env.PORT;

app.use(cors({
    origin:"https://echogram-vn2.vercel.app/",
    credentials:true
}))
app.use(express.json());
app.use(cookieParser());


app.get("/ping", (req, res) => {
  res.status(200).send("Server is alive");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/loop", loopRouter);
app.use("/api/story", storyRouter);
app.use("/api/message", messageRouter);

server.listen(port, () => {
  connectDb();
  console.log("server started on port", port);
});

