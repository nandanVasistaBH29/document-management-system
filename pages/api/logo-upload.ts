// src code for how to handle file uploads on the fileSystem locally in NEXT.js https://gist.github.com/ndpniraj/2735c3af00a7c4cbe50602ffe6209fc3
import { NextApiHandler, NextApiRequest } from "next";
import formidable from "formidable"; //a package which makes uploading files inside next.js a cake walk
import path from "path";
import fs from "fs/promises";
//disabling the default bodyparser
export const config = {
  api: {
    bodyParser: false,
  },
};
// Promise
const readFile = (
  req: NextApiRequest,
  saveLocally?: boolean
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const orgName = req.query.orgName;

  const options: formidable.Options = {};
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "/public/logo");
    options.filename = (name, ext, path, form) => {
      return orgName + Date.now().toString() + "_" + path.originalFilename;
    };
  }
  options.maxFileSize = 4000 * 1024 * 1024;
  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

const handler: NextApiHandler = async (req, res) => {
  //check if dir exists or not
  try {
    await fs.readdir(path.join(process.cwd() + "/public", "/logo"));
  } catch (error) {
    await fs.mkdir(path.join(process.cwd() + "/public", "/logo"));
  }
  await readFile(req, true); //send the req object and as we want to save it locally send true
  res.json({ done: "ok" });
};

export default handler;
