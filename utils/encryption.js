const crypto = require("crypto"); // encryption lib
const ALGORITHM = "aes-256-ctr";
let KEY = "nandan"; // keep this in env.local
//hashing the key
KEY = crypto
  .createHash("sha256")
  .update(String(KEY))
  .digest("base64")
  .substring(0, 32);

//encrypt func
export const encrypt = (buffer) => {
  //intialising vector
  const iv = crypto.randomBytes(16);

  // create a new cipher using the algo,lb,key
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  //create a new encrypted buff
  const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
  return result;
};
