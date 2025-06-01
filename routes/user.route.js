import express from "express";
import {
  signIn,
  signUp,
  signOut,
  profilePage,
  uploadProfile,
  uploadPost,
  uploadPostImg,
  userPosts,
  Userchats,
  checkForUserName,
} from "../controller/user.controller.js";
import { auth } from "../middleware/auth.js";
import multer from "multer";
const upload = multer({ dest: "public/user_post" });
// add this above your routes
const postStorage = multer.diskStorage({
  destination: "public/post_uploads",
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  },
});

const uploadPostImage = multer({ storage: postStorage });

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/validate-username/:userName", checkForUserName);
router.get("/sign-out", signOut);
router.get("/profile", auth, profilePage);
router.post("/profile", auth, upload.single("profile"), uploadProfile);
router.get("/upload-post", auth, uploadPostImg);
router.post(
  "/upload-post",
  auth,
  uploadPostImage.single("postImage"),
  uploadPost
);
router.get("/chat", auth, Userchats);
router.get("/posts", auth, userPosts);

export default router;
