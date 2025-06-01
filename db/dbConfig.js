import mysql from "mysql2";

const pool = mysql.createPool({
  user: "sql12782526",
  password: "wTmuLmLzwh",
  database: "sql12782526",
  host: "sql12.freesqldatabase.com",
  port: 3306,
});

export default pool;
