import { useState, useEffect } from "react";
import fs from "fs/promises";
import path from "path";
import axios from "axios";
const AddDoc = ({ dirs }) => {
  const [selectedFile, setSelectedFile] = useState();
  const [creds, setCreds] = useState({
    isAdmin: "",
    oid: "",
    uid: "",
    email: "",
    organizationName: "",
  });
  const [logoURL, setLogoURL] = useState("");
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("org-doc-user-creds"));
    setCreds(data);
    setLogoURL(
      "/logo/" + dirs.filter((dir) => dir.includes(data.organizationName))
    );
  }, []);
  const handleUpload = async (e) => {
    e.preventDefault();
    console.log(selectedFile);
    try {
      if (
        !selectedFile ||
        creds.organizationName === "" ||
        creds.uid === undefined
      ) {
        return;
      }
      const formData = new FormData();
      formData.append("file", selectedFile); // this "file" is very IMP it should match with backend
      const { data } = await axios.post(
        `/api/documents/doc-upload?organizationName=${creds.organizationName}&email=${creds.email}`,
        formData
      );
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <h2 className="text-3xl text-orange-600">Upload Doc</h2>
      <form className="flex justify-around items-center">
        <div>
          {logoURL && (
            <div>
              <img
                className="h-40 rounded-full"
                src={logoURL}
                alt="company logo"
              />
            </div>
          )}
          <div>
            <label className="text-xl text-orange-400">Title</label>
            <input
              className="p-2 m-2 border-2 rounded-sm border-orange-300 space-x-2"
              type="text"
              name="title"
              min={10}
              max={30}
              placeholder="name/title of the file"
            />
          </div>
          <div className="flex items-start">
            <label className="text-xl text-orange-400 ">Description</label>
            <textarea
              rows={3}
              cols={40}
              name="description"
              className="border-2 p-2 m-2 rounded-sm border-orange-300 space-x-2"
              placeholder="detailed description"
            ></textarea>
          </div>
          <div>
            <div className=" mb-4">
              <label>
                <input
                  type="file"
                  hidden
                  onChange={({ target }) => {
                    if (target.files) {
                      const file = target.files[0];
                      setSelectedFile(file);
                    }
                  }}
                />
                <div className="w-40 aspect-video rounded flex items-center justify-center border-2 border-dashed cursor-pointer">
                  {selectedFile ? (
                    <img src={selectedFile} alt="Can't preview pdf and word" />
                  ) : (
                    <span>Select PDF,Word</span>
                  )}
                </div>
              </label>
              <button
                onClick={handleUpload}
                className="bg-red-600 p-3 w-32 text-center rounded text-white"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddDoc;
export const getServerSideProps = async () => {
  const props = { dirs: [] };
  try {
    const dirs = await fs.readdir(path.join(process.cwd(), "/public/logo"));
    props.dirs = dirs;
    return { props };
  } catch (error) {
    return { props };
  }
};
