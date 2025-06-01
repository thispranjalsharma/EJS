import express from "express";
import { auth as ensureLoggedIn } from "../middleware/auth.js";
import multer from "multer";
import pool from "../db/dbConfig.js";

const router = express.Router();

// add this above your routes
const msgStorage = multer.diskStorage({
  destination: "public/uploads",
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  },
});

const uploadMessageImage = multer({ storage: msgStorage });

router.get("/:id", ensureLoggedIn, async (req, res) => {
  const userId = req.session.currentUser.id;
  const friendId = parseInt(req.params.id);

  // Fetch messages where current user is sender or receiver
  const sql = `
    SELECT * FROM messages 
    WHERE (sender_id = ? AND receiver_id = ?) 
       OR (sender_id = ? AND receiver_id = ?)
    ORDER BY created_at ASC
  `;
  pool.query(sql, [userId, friendId, friendId, userId], (err, results) => {
    if (err) return res.status(500).send("Database error");
    res.render("chat-interface", { messages: results, userId, friendId });
  });
});

router.post(
  "/send",
  ensureLoggedIn,
  uploadMessageImage.single("media"),
  (req, res) => {
    const { to, message } = req.body;
    const from = req.session.currentUser.id;
    const media = req.file ? req.file.filename : null;

    const sql =
      "INSERT INTO messages (sender_id, receiver_id, message, media_path) VALUES (?, ?, ?, ?)";
    pool.query(sql, [from, to, message, media], (err) => {
      if (err) return res.status(500).send("Send failed");
      res.redirect(`/chat/${to}`);
    });
  }
);

export default router;
