import mysql from "mysql";
// connection to mysql running on the same linux server
export const pool = mysql.createPool({
  host: process.env.DATABASE_ENDPOINT,
  user: process.env.DATABASE_USER,
  port: process.env.DATABASE_PORT,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
});
