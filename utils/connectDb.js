import mysql from "mysql";
// connection to mysql running on the same linux server
//PLEASE KEEP THIS in ENV FILE
export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  port: 3306,
  password: "nandan1234",
  database: "orgdb",
});
