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
