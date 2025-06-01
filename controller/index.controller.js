import User from "../model/user.model.js";

export const indexPage = (req, resp, next) => {
  User.getAllPost()
    .then((result) => {
      return resp.render("index.ejs", { posts: result });
    })
    .catch((err) => {
      console.log(err);
      resp.end("Something wrong... in getAllPost section");
    });
};

export const aboutPage = (req, resp, next) => {
  return resp.render("about.ejs");
};

export const signUpPage = (req, resp, next) => {
  return resp.render("signup.ejs");
};

export const signInPage = (req, resp, next) => {
  return resp.render("signin.ejs");
};
