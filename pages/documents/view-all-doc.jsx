import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

const ViewAllDoc = () => {
  const [users, setUsers] = useState([]);
  const [organizationName, setOrganizationName] = useState("");
  useEffect(() => {
    fetchUsers();
  }, []);
  const fetchUsers = async () => {
    try {
      const data = await JSON.parse(localStorage.getItem("org-doc-user-creds"));
      const oid = data.oid;
      setOrganizationName(data.organizationName);
      const res = await axios.get(`/api/auth/get-all-users?oid=${oid}`);
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {users !== [] && (
        <div>
          {users.map((user) => {
            const data = { ...user, organizationName };
            return (
              <Link
                key={user.uid}
                href={{
                  pathname: `/users/${user.uid}`,
                  query: { data: JSON.stringify(data) },
                }}
              >
                <h3>Name : {user.email}</h3>
                <h3>Uid : {user.uid}</h3>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ViewAllDoc;
