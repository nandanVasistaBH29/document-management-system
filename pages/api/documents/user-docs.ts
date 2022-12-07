// src code for how to handle file uploads on the fileSystem locally in NEXT.js https://gist.github.com/ndpniraj/2735c3af00a7c4cbe50602ffe6209fc3
/*
/api/documents/user-docs.ts
clarity: < br/> 1.written in TypeScript to return all the docs of that particular user only
2.if u need to fetch the encrypted files then 1 else 0 for decrypted files but its mandatory to pass either 0 or 1 ip : organizationName, email,encrypted
op : array of file names
*/
import { NextApiHandler, NextApiRequest } from "next";
import path from "path";
import fs from "fs/promises";
//disabling the default bodyparser
export const config = {
  api: {
    bodyParser: false,
  },
};
// Promise

const handler: NextApiHandler = async (req, res) => {
  //check if dir exists or not
  const { organizationName, email, encrypted } = req.query;
  const PATH =
    process.cwd() + "/public/storage" + `/${organizationName}/${email}/`;
  try {
    const dir = await fs.readdir(PATH); // if dir is there
    const files = [];
    dir.forEach((file) => {
      console.log(file.includes("decrypted") && encrypted === "true");
      if (encrypted === "true" && !file.includes("decrypted")) {
        files.push(file);
      } else if (encrypted === "false" && file.includes("decrypted")) {
        files.push(file);
      }
    });

    return res.status(200).json(files);
  } catch (error) {
    console.log(error);
    res.status(200).json({ err: "no files uploaded" });
  }
};

export default handler;
