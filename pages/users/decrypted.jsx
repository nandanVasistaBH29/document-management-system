import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
const Decrypted = () => {
  const [user, setUser] = useState({});
  const [files, setFiles] = useState([]);
  useEffect(() => {
    getAllDetails();
  }, []);
  const getAllDetails = async () => {
    const data = JSON.parse(localStorage.getItem("org-doc-user-creds"));
    try {
      const res = await axios.get(
        `/api/documents/user-docs?organizationName=${
          data.organizationName
        }&email=${data.email}&encrypted=${false}`
      );
      console.log(res);
      if (res.data.err) return;
      setFiles(res.data);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
    setUser(data);
  };
  return (
    <div>
      <h1>Decrypted Files -reload the page if you can't see the file</h1>
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
              return (
                <>
                  <h4>{file}</h4>
                  <a href={file} download="download.pdf">
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
    </div>
  );
};

export default Decrypted;
