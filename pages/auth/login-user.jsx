import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
const LoginUser = () => {
  const route = useRouter();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    organizationName: "",
  });
  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/auth/login-user", inputs);
      if (res.data.err) return;
      const data = res.data;
      if (localStorage.getItem("org-doc-user-creds")) {
        localStorage.removeItem("org-doc-user-creds"); // same device can be used by 2 diff accounts
      }
      localStorage.setItem(
        "org-doc-user-creds",
        JSON.stringify({
          uid: data.uid,
          email: data.email,
          isAdmin: data.isAdmin,
          oid: data.oid,
          organizationName: inputs.organizationName,
        })
      );
      route.push("/dashboard");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <section className="bg-gray-50">
        <div className="flex flex-col items-center justify-center px-3 py-4 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your organization
              </h1>
              <form className="space-y-4 md:space-y-6">
                <div>
                  <label
                    for="organization"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your Organization
                  </label>
                  <input
                    type="organizationName"
                    name="organizationName"
                    value={inputs.organizationName}
                    onChange={(e) => handleChange(e)}
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required=""
                  />
                </div>
                <div>
                  <label
                    for="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={inputs.email}
                    onChange={(e) => handleChange(e)}
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required=""
                  />
                </div>

                <div>
                  <label
                    for="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={inputs.password}
                    onChange={(e) => handleChange(e)}
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                  />
                </div>

                <button
                  type="submit"
                  onClick={(e) => handleSubmit(e)}
                  className="w-full text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
                >
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginUser;
