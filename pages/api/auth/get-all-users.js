/*
   /api/auth/get-all-users.js
   desc: getting all the users belong to a particular organization with a particular oid
   req: dbconnection
   method:GET
   ip:oid
   op: success: status(200).json(data); // an array of all users
   cause of failure:
   1.DB pool not able to provide a connection
   2.ORG not found Violation of foreign key constraint
   */

import { pool } from "../../../utils/connectDb";
export default function handler(req, res) {
  const oid = req.query.oid;
  console.log("====================================");
  console.log(req.query.oid);
  console.log("====================================");
  const q = `select * from users where oid=${oid}`;
  pool.getConnection(function (err, db) {
    if (err) return res.json(err);
    db.query(q, [], (err, data) => {
      if (err) {
        console.log(err);
        return res.json({ err });
      }
      db.release();
      return res.status(200).json(data);
    });
  });
}
