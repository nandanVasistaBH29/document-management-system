import fs from "fs";
import { decrypt } from "../../../utils/decryption";
export default async function (req, res) {
  const path = req.body.path;
  let abspath = process.cwd() + "/public/storage/" + path;
  fs.readFile(abspath, async (err, file) => {
    if (err) return console.error(err.message);
    if (file) {
      abspath = abspath.slice(0, -4);
      console.log(abspath);
      // "decrypted" keyword is imp in the file name that is used to filter
      const newDecryptedFilePath =
        abspath + "decrypted" + Date.now().toString() + ".pdf";
      const decyptedFile = await decrypt(file);
      fs.writeFile(
        newDecryptedFilePath,
        decyptedFile,
        {
          encoding: "utf8",
          flag: "w",
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
