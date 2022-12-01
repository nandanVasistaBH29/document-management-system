import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
const getQueryParams = (query) => {
  return query
    ? (/^[?#]/.test(query) ? query.slice(1) : query)
        .split("&")
        .reduce((params, param) => {
          let [key, value] = param.split("=");
          params[key] = value
            ? decodeURIComponent(value.replace(/\+/g, " "))
            : "";
          return params;
        }, {})
    : {};
};

const User = () => {
  const [user, setUser] = useState({});
  const [files, setFiles] = useState([]);
  const [decryptpath, setDecryptPath] = useState("");
  useEffect(() => {
    getAllDetails();
  }, []);

  const getAllDetails = async () => {
    const { data } = getQueryParams(window.location.search);
    const art = await JSON.parse(data);
    try {
      const res = await axios.get(
        `/api/documents/user-docs?organizationName=${
          art.organizationName
        }&email=${art.email}&encrypted=${true}`
      );
      if (res.data.err) return;
      setFiles(res.data);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
    setUser(art);
  };
  const handleDecypt = async (path) => {
    const res = await axios.post(`/api/documents/decryption`, { path });
    console.log(res);
  };
  return (
    <div>
      {user && (
        <>
          <h2>{user.email}</h2>
          <h3>{user.organizationName}</h3>
        </>
      )}
      {files !== [] ? (
        <>
          {files.map((file) => {
            console.log("====================================");
            console.log(
              "/storage/" +
                user.organizationName +
                "/" +
                user.email +
                "/" +
                file
            );
            console.log("====================================");
            return (
              <>
                <h4>{file}</h4>
                <Link
                  href={"/users/decrypted"}
                  onClick={() =>
                    handleDecypt(
                      "/storage/" +
                        user.organizationName +
                        "/" +
                        user.email +
                        "/" +
                        file
                    )
                  }
                >
                  Decrypt The File First
                </Link>
                <a
                  role="button"
                  href={decryptpath}
                  download="proposed_file_name.pdf"
                >
                  Download
                </a>
              </>
            );
          })}
        </>
      ) : (
        <h4>No files</h4>
      )}
    </div>
  );
};

export default User;
