import { pool } from "../../../utils/connectDb";
import bcrypt from "bcryptjs"; // to verify password
export default function handler(req, res) {
  let q = `select oid from organization where organizationName="${req.body.organizationName}"`;
  console.log(q);
  pool.getConnection(function (err, db) {
    if (err) return res.json(err);
    db.query(q, [], (err, data) => {
      if (err) {
        console.log(err);
        return res.json({ err: err });
      }
      console.log(req.body.organizationName);
      console.log(data);
      const oid = data[0].oid;
      q = `select * from users where oid=${oid} and email="${req.body.email}"`;
      db.query(q, [], (err, data) => {
        if (err) {
          console.log(err);
          return res.json({ err });
        }
        const user_password = req.body.password;
        if (data.length === 0) {
          db.release();
          return res
            .status(404)
            .json("Email hasn't register Please register first");
        }
        // compare password
        if (user_password) {
          const isPasswordCorrect = bcrypt.compareSync(
            user_password,
            data[0].password
          ); // true;
          if (!isPasswordCorrect) {
            db.release();
            return res.status(404).json("Either Password or email is wrong");
          }
        }
        res.status(200).json(data[0]);
        db.release();
      });
    });
  });
}
