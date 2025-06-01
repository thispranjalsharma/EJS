import pool from "../db/dbConfig.js";

export const getDiscussionPage = (req, res) => {
  const sql = `
    SELECT q.*, u.name, u.profile
    FROM discussion_questions q
    JOIN user u ON q.user_id = u.id
    ORDER BY q.created_at DESC
  `;

  pool.query(sql, (err, questions) => {
    if (err) return res.status(500).send("DB error");

    const ids = questions.map((q) => q.id);
    if (!ids.length)
      return res.render("discussion.ejs", { questions, replies: [] });

    const replySQL = `
      SELECT r.*, u.name, u.profile
      FROM discussion_replies r
      JOIN user u ON r.user_id = u.id
      WHERE r.question_id IN (?)
      ORDER BY r.created_at ASC
    `;

    pool.query(replySQL, [ids], (err, replies) => {
      if (err) return res.status(500).send("DB error");
      res.render("discussion.ejs", { questions, replies });
    });
  });
};

export const postQuestion = (req, res) => {
  const userId = req.session.currentUser.id;
  const question = req.body.question;
  const media = req.file?.filename || null;

  const sql = `INSERT INTO discussion_questions (user_id, question, media) VALUES (?, ?, ?)`;
  pool.query(sql, [userId, question, media], (err) => {
    if (err) return res.status(500).send("Failed to post");
    res.redirect("/discussion");
  });
};

export const postReply = (req, res) => {
  const userId = req.session.currentUser.id;
  const reply = req.body.reply;
  const media = req.file?.filename || null;
  const questionId = req.params.id;

  const sql = `INSERT INTO discussion_replies (question_id, user_id, reply, media) VALUES (?, ?, ?, ?)`;
  pool.query(sql, [questionId, userId, reply, media], (err) => {
    if (err) return res.status(500).send("Failed to reply");
    res.redirect("/discussion");
  });
};
