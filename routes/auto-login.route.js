export const autoLogin = (req, res) => {
  const user = req.body.user;
  console.log(user);
  if (user && user.id) {
    req.session.currentUser = user;
    req.session.isLoggedIn = true;
    return res.json({ success: true });
  } else {
    return res.json({ success: false });
  }
};
