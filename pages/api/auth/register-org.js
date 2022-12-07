/*
4. /api/auth.register-org.js
   req:bcryptjs(for hashing the password) and dbconnection
   method:POST
   ip:organizationName,email,password,phone
   clarity:the logo upload is handled by diff api call
   op: .status(200).json("org has been created");
   cause of failure:
   1.DB pool not able to provide a connection
   2.ORG already exist or org name must be unique
*/
import { pool } from "../../../utils/connectDb";
import bcrypt from "bcryptjs";
export default function handler(req, res) {
  const q = "select * from organization where organizationName=?";
  pool.getConnection(function (err, db) {
    if (err) return res.json(err);
    db.query(q, [req.body.organizationName], (err, data) => {
      if (err) {
        console.log(err);
        return res.json({ err });
      }
      if (data.length)
        return res.status(409).json("organizationName already exists");
      // hash the password
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);

      const q =
        "insert into organization(organizationName,email,password,phone) values (?)";
      const values = [
        req.body.organizationName,
        req.body.email,
        hash,
        req.body.phone,
      ];
      db.query(q, [values], (err, data) => {
        if (err) {
          db.release();
          return res.json({ err });
        }
        db.release();
        return res.status(200).json("org has been created");
      });
    });
  });
}
