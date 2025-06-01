// import { response } from "express";
import User from "../model/user.model.js";

export const checkForUserName = (request, response, next) => {
  const username = request.params.username;

  User.hasUserName(username)
    .then((result) => {
      console.log(result.length);
      if (result.length === 0)
        return response
          .status(200)
          .json({ success: true, message: "Username is available" });
      else
        return response
          .status(200)
          .json({ success: false, message: "Username is already taken" });
    })
    .catch((err) => {
      console.error("Error checking username:", err);
      response.status(500).json({
        success: false,
        message: "Something went wrong while checking username",
      });
    });
};

export const userPosts = (request, response, next) => {
  const userId = request.session.currentUser?.id;
  User.userPosts(userId)
    .then((result) => {
      return response.render("posts.ejs", {
        posts: result,
        currentUser: request.session.currentUser,
        isLoggedIn: request.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      response.end("Something wrong...");
    });
};

export const uploadPostImg = (request, response, next) => {
  console.log("uploadPostImage");
  return response.render("uploadPost.ejs");
};

export const uploadPost = (req, response, next) => {
  const userId = req.session.currentUser?.id;
  console.log("uploadPost", userId);

  const fileName = req.file.filename;
  const caption = req.body.caption || "";

  User.uploadPost(fileName, caption, userId)
    .then((result) => {
      return response.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      response.end("Something wrong...");
    });
};
export const uploadProfile = (request, response, next) => {
  if (request.file) {
    const fileName = request.file.filename;
    const userId = request.session.currentUser.id;

    User.uploadOne(fileName, userId)
      .then((updatedUser) => {
        // Update session with the new user data
        request.session.currentUser.profile = fileName;

        // Send updated data to client for localStorage update
        response.json({
          success: true,
          user: { ...request.session.currentUser },
        });
      })
      .catch((err) => {
        console.log(err);
        response
          .status(500)
          .json({ success: false, message: "Something went wrong" });
      });
  } else {
    response.status(400).json({ success: false, message: "No file uploaded" });
  }
};

export const profilePage = (request, response, next) => {
  console.log("profile pages");

  return response.render("profile.ejs", {
    currentUser: request.session.currentUser,
    isLoggedIn: request.session.isLoggedIn,
  });
};

export const signOut = (req, response, next) => {
  console.log(req.session.isLoggedIn);
  req.session.isLoggedIn = false;
  req.session.currentUser = null;
  req.session.destroy();
  console.log("user signOut");
  return response.redirect("/");
};

export const signUp = (req, response, next) => {
  // console.log(req.body);
  let { name, email, phone, password, username } = req.body;
  let user = new User(null, name, email, phone, password, username);

  user
    .create()
    .then((result) => {
      return response.redirect("/sign-in");
    })
    .catch((err) => {
      console.log(err);
      response.end("Something wrong...");
    });
};

export const signIn = (req, resp, next) => {
  let { email, password } = req.body;
  User.find(email, password)
    .then((result) => {
      // console.log(result);
      if (result.length) {
        req.session.isLoggedIn = true;
        // let a= true;
        req.session.currentUser = result[0];
        return resp.json({
          success: true,
          user: result[0], // or user data you want to save
        });
      } else return resp.redirect("/sign-in");
    })
    .catch((err) => {
      console.error("Sign-in error:", err);
      resp.end("Something wrong....");
    });
};

export const Userchats = (request, resp, next) => {
  const userId = request.session.currentUser.id;
  User.getAllUsersData()
    .then((result) => {
      // console.log(result);
      const filteredResult = result.filter((user) => user.id !== userId);
      return resp.render("chat.ejs", {
        users: filteredResult,
        currentUser: request.session.currentUser,
        isLoggedIn: request.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      resp.end("Something wrong... in USerCahts");
    });
};
