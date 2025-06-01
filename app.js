import express from "express";
import IndexRouter from "./routes/index.route.js";
import UserRouter from "./routes/user.route.js";
import ChatRouter from "./routes/chat.route.js";

import http from "http";
import { Server } from "socket.io";

import bodyParser from "body-parser";
import session from "express-session";
import { autoLogin } from "./routes/auto-login.route.js";
import DiscussionRouter from "./routes/discussion.route.js";

const app = express();
app.use(
  session({
    secret: "youCanDoIt",
  })
);

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("./public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use((req, res, next) => {
  res.locals.currentUser = req.session.currentUser || null;
  res.locals.isLoggedIn = req.session.isLoggedIn || false;
  next();
});

app.set("io", io); // Optional if needed elsewhere
app.use((req, res, next) => {
  res.locals.io = io; // Useful in templates
  next();
});

// Real-time messaging logic
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("send-location", (data) => {
    console.log(data);
    io.emit("receiveLocation", { id: socket.id, ...data });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });

  socket.on("joinRoom", ({ userId, friendId }) => {
    const room = [userId, friendId].sort().join("_");
    socket.join(room);
  });

  socket.on("sendMessage", (msg) => {
    const room = [msg.sender_id, msg.receiver_id].sort().join("_");
    io.to(room).emit("newMessage", msg);
  });

  socket.on("typing", ({ room, userId }) => {
    socket.to(room).emit("typing", userId);
  });
});

app.use("/", IndexRouter);
app.use("/user", UserRouter);
app.use("/chat", ChatRouter);
app.post("/auto-login", autoLogin);
app.use("/discussion", DiscussionRouter);

server.listen(3000, () => {
  console.log("Server started on port 3000");
});
