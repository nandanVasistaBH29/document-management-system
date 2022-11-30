import fs from "fs";
import { encrypt } from "./encryption";
export const encryptFile = (path) => {
  fs.readFile(path, async (err, file) => {
    if (err) return console.error(err.message);
    // encrypt the data inside the file
    fs.unlinkSync(path); // delete the non encrypted file
    const encryptedFile = encrypt(file);
    fs.writeFile(path, encryptedFile, (err, file) => {
      if (err) return console.error(err.message);
      if (file) {
        console.log("success");
      }
    });
  });
};
