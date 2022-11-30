import fs from "fs";
import { decrypt } from "../../../utils/decryption";
export default async function (req, res) {
  const path = req.body.path;
  const abspath = process.cwd() + "/public" + path;
  fs.readFile(abspath, (err, file) => {
    if (err) return console.error(err.message);
    if (file) {
      // "decrypted" keyword is imp in the file name that is used to filter
      const newDecryptedFilePath =
        abspath + "decrypted" + Date.now().toString();
      const decyptedFile = decrypt(file);
      fs.writeFile(
        newDecryptedFilePath,
        decyptedFile,
        {
          encoding: "utf8",
          flag: "w",
          mode: 0o666,
        },
        (err, file) => {
          if (err) return console.error(err.message);
          if (file) {
            console.log("success");
          }
        }
      );
    }
  });
}
