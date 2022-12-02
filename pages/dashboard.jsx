import { useState, useEffect } from "react";
import Link from "next/link";
import fs from "fs/promises";
import path from "path";
import axios from "axios";
import process from "process";
const dashboard = ({ dirs, check }) => {
  // check is nothing but abs path to the dir where next.js runs
  const [creds, setCreds] = useState({
    isAdmin: "",
    oid: "",
    uid: "",
    email: "",
    organizationName: "",
  });
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    organizationName: "",
    isAdmin: 0,
  });
  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };
  const [showModel, setShowModel] = useState(false);
  const [logoURL, setLogoURL] = useState("");
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("org-doc-user-creds"));
    setCreds(data);
    setLogoURL(
      "http://13.127.184.210/public/logo/" +
        dirs.filter((dir) => dir.includes(data.organizationName))
    );
  }, []);
  const createUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/create-user", inputs);
      console.log(res);
      if (res.data.err) return;
      const data = res.data;
      setShowModel(false);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="p-4 m-4">
      {creds.organizationName !== "" && (
        <div>
          <div className="flex items-center justify-around">
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
            </div>
            <div>
              <h2 className="text-xl">
                organizationName :{" "}
                <span className="font-extrabold text-orange-500">
                  {creds.organizationName}
                </span>
              </h2>
              <h3>
                user id :{" "}
                <span className="font-bold text-orange-500">{creds.uid}</span>
              </h3>
              <h3>
                Root User{" "}
                <span className="font-bold text-orange-500">
                  {creds.isAdmin === 1 ? "YES!" : "NO"}
                </span>
              </h3>
              <h4>
                user email :{" "}
                <span className="font-medium text-orange-500">
                  {creds.email}
                </span>
              </h4>
            </div>
          </div>
          <div className="p-2 m-2 flex justify-center items-center">
            <Link
              className="block w-max font-extrabold focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300  rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900"
              href={"/documents/add-doc"}
            >
              Add New Documents
            </Link>
            <Link
              className="block w-max font-extrabold focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900"
              href={`/documents/view-all-doc?oid=${creds.oid}`}
            >
              View All Documents
            </Link>
            {creds.isAdmin === 1 && (
              <button
                onClick={() => setShowModel(true)}
                className="block w-max text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
              >
                Create a new Non root user
              </button>
            )}
          </div>
        </div>
      )}
      {showModel && creds && (
        <form className="flex flex-col justify-center items-center">
          <div className="flex justify-around items-center">
            <label htmlFor="email" className="space-x-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={inputs.email}
              className="border-orange-400 border-2 p-2 m-2"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="mt-2 flex justify-around items-center">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={inputs.password}
              className="border-orange-400 border-2 p-2 m-2 "
              onChange={(e) => handleChange(e)}
            />
          </div>
          <button
            type="submit"
            onClick={(e) => {
              setInputs({
                ...inputs,
                organizationName: creds.organizationName,
              });
              createUser(e);
            }}
            className=" text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
          >
            Create User
          </button>
        </form>
      )}
    </div>
  );
};

export default dashboard;
export const getServerSideProps = async () => {
  const props = { dirs: [] };
  try {
    const check = process.cwd();
    const dirs = await fs.readdir(path.join(process.cwd(), "/public/logo"));
    props.dirs = dirs;
    props.check = check;
    return { props };
  } catch (error) {
    return { props };
  }
};
