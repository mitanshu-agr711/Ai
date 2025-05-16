import Express  from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./model/connect.js";

const app = Express();
const httpServer = createServer(app);
connectDB();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send("Hey there! This is the server for the chat app.");
});

app.listen(3000, () => {
    console.log(`Server is running on port  3000`);
})
