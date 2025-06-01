import express from "express";
import IndexRouter from "./routes/index.route.js";
import UserRouter from "./routes/user.route.js";
import ChatRouter from "./routes/chat.route.js";

import bodyParser from "body-parser";
import session from "express-session";
import { autoLogin } from "./routes/auto-login.route.js";

const app = express();
app.use(
  session({
    secret: "youCanDoIt",
  })
);

app.use(express.static("./public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use((req, res, next) => {
  res.locals.currentUser = req.session.currentUser || null;
  res.locals.isLoggedIn = req.session.isLoggedIn || false;
  next();
});

app.use("/", IndexRouter);
app.use("/user", UserRouter);
app.use("/chat", ChatRouter);
app.post("/auto-login", autoLogin);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
