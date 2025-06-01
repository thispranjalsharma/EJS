import express from "express";
import multer from "multer";
import { auth } from "../middleware/auth.js";
import {
  getDiscussionPage,
  postQuestion,
  postReply,
} from "../controller/discussion.controller.js";

const router = express.Router();

const discussionStorage = multer.diskStorage({
  destination: "public/discussion",
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  },
});

const uploadDiscussion = multer({ storage: discussionStorage });

router.get("/", auth, getDiscussionPage);
router.post("/ask", auth, uploadDiscussion.single("media"), postQuestion);
router.post("/reply/:id", auth, uploadDiscussion.single("media"), postReply);

export default router;
