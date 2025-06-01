import pool from "../db/dbConfig.js";

class User {
  constructor(id, name, email, phone, password, username) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.username = username;
  }

  static hasUserName(username) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, con) => {
        if (!err) {
          let sql = "select * from user where username = ?";
          con.query(sql, [username], (err, result) => {
            con.release();
            err ? reject(err) : resolve(result);
          });
        } else reject(err);
      });
    });
  }
  static getAllPost() {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, con) => {
        if (!err) {
          let sql =
            "SELECT post.image AS postImage, post.caption, post.created_at, user.id AS userId, user.profile FROM post JOIN user ON  post.user_id = user.id ORDER BY post.id DESC";
          con.query(sql, (err, result) => {
            con.release();
            err ? reject(err) : resolve(result);
          });
        } else reject(err);
      });
    });
  }

  static getAllUsersData() {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, con) => {
        if (!err) {
          let sql = "select * from user";
          con.query(sql, (err, result) => {
            con.release();
            err ? reject(err) : resolve(result);
          });
        } else reject(err);
      });
    });
  }

  static userPosts(userId) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, con) => {
        if (!err) {
          let sql = "select * from post where user_id = ?";
          con.query(sql, [userId], (err, result) => {
            con.release();
            err ? reject(err) : resolve(result);
          });
        } else reject(err);
      });
    });
  }

  static uploadPost(fileName, caption, userId) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, con) => {
        if (!err) {
          let sql = "insert into post(image, caption, user_id) values(?, ?, ?)";
          con.query(sql, [fileName, caption, userId], (err, result) => {
            con.release();
            err ? reject(err) : resolve(result);
          });
        } else reject(err);
      });
    });
  }

  static uploadOne(fileName, userId) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, con) => {
        if (!err) {
          let sql = "update user set profile = ? where id = ?";
          con.query(sql, [fileName, userId], (err, result) => {
            con.release();
            err ? reject(err) : resolve(result);
          });
        } else reject(err);
      });
    });
  }

  create() {
    return new Promise((resolve, reject) => {
      pool.query(
        "insert into user(name, email, phone, password ,username) values(?, ?, ?,?,?)",
        [this.name, this.email, this.phone, this.password, this.username],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  static find(email, password) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, con) => {
        if (!err) {
          let sql = "select * from user where email = ? and password = ?";
          con.query(sql, [email, password], (err, result) => {
            con.release();
            err ? reject(err) : resolve(result);
          });
        } else reject(err);
      });
    });
  }
}

export default User;
