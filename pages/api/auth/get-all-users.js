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
