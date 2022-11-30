const crypto = require("crypto"); // encryption lib
const ALGORITHM = "aes-256-ctr";
let KEY = "nandan"; // keep this in env.local
//hashing the key
KEY = crypto
  .createHash("sha256")
  .update(String(KEY))
  .digest("base64")
  .substring(0, 32);
export const decrypt = (encrypted) => {
  // get the iv : the first 16 bytes
  const iv = encrypted.slice(0, 16);
  //get the rest of encrypted data
  encrypted = encrypted.slice(16);
  // create decipher
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  // decrypt it
  const result = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return result;
};
