// /api/auth/register-org"
// /api/register
// POST
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
