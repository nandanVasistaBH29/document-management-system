/*
/api/auth/create-user.js
   req: bcryptjs(for hashing the password) and dbconnection
   method:POST
   ip:email,password,oid,isAdmin ; oid=>is the foriegn key stands for organization_id primary key of organization table
   op: success: status(200).json("user has been created");
   cause of failure:
   1.DB pool not able to provide a connection
   2.ORG not found Violation of foreign key constraint
   3.user already exist : email must be unique for an user
*/

import { pool } from "../../../utils/connectDb";
import bcrypt from "bcryptjs";
export default function handler(req, res) {
  const q = "select oid from organization where organizationName=?";
  pool.getConnection(function (err, db) {
    if (err) return res.json(err);
    db.query(q, [req.body.organizationName], (err, data) => {
      if (err) {
        console.log(err);
        return res.json({ err });
      }
      console.log(data[0].oid);
      // hash the password
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);

      const q = "insert into users(email,password,oid,isAdmin) values (?)";
      const values = [req.body.email, hash, data[0].oid, req.body.isAdmin];
      db.query(q, [values], (err, data) => {
        if (err) {
          db.release();
          return res.json({ err });
        }
        db.release();
        return res.status(200).json("user has been created");
      });
    });
  });
}
