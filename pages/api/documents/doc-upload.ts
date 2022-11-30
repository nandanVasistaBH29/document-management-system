// src code for how to handle file uploads on the fileSystem locally in NEXT.js https://gist.github.com/ndpniraj/2735c3af00a7c4cbe50602ffe6209fc3
import { NextApiHandler, NextApiRequest } from "next";
import formidable from "formidable"; //a package which makes uploading files inside next.js a cake walk
import path from "path";
import fs from "fs/promises";
import { encryptFile } from "../../../utils/encrptFile";
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
  const { organizationName, email } = req.query;
  let filePath =
    process.cwd() + `/public/storage/${organizationName}/${email}/`;
  const options: formidable.Options = {};
  if (saveLocally) {
    options.uploadDir = path.join(
      process.cwd(),
      `/public/storage/${organizationName}/${email}/`
    );
    options.filename = (name, ext, path, form) => {
      const filename = Date.now().toString() + "_" + path.originalFilename;
      filePath += filename;
      return filename;
    };
  }
  options.maxFileSize = 16000 * 1024 * 1024;
  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
      console.log(filePath);
      encryptFile(filePath); // call for encryption
    });
  });
};

const handler: NextApiHandler = async (req, res) => {
  //check if dir exists or not
  const { organizationName, email } = req.query;
  console.log(organizationName, email);
  try {
    await fs.readdir(
      path.join(
        process.cwd() + "/public/storage",
        `/${organizationName}/${email}`
      )
    ); // if dir is there
  } catch (error) {
    try {
      await fs.mkdir(
        path.join(
          process.cwd() + "/public/storage",
          `/${organizationName}/${email}`
        )
      ); // if user dir is there then org will there too
    } catch (error) {
      try {
        await fs.mkdir(
          path.join(process.cwd() + "/public/storage", `/${organizationName}`)
        ); // if org dir is not there then create it first

        await fs.mkdir(
          path.join(
            process.cwd() + "/public/storage",
            `/${organizationName}/${email}`
          )
        );
      } catch (error) {
        await fs.mkdir(path.join(process.cwd(), "/public/storage"));
        await fs.mkdir(
          path.join(process.cwd() + "/public/storage", `/${organizationName}`)
        ); // if org dir is not there then create it first
        await fs.mkdir(
          path.join(
            process.cwd() + "/public/storage",
            `/${organizationName}/${email}`
          )
        ); // then create user dir
      }
    }
  }
  await readFile(req, true); //send the req object and as we want to save it locally send true
  res.json({ done: "ok" });
};

export default handler;
