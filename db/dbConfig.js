import mysql from "mysql2";

const pool = mysql.createPool({
  user: "root",
  password: "root",
  database: "we",
  host: "localhost",
});

export default pool;
