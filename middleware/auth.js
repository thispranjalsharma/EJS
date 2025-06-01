export const auth = (req, response, next) => {
  if (req.session.isLoggedIn) {
    next();
  } else return response.redirect("/sign-in");
};
