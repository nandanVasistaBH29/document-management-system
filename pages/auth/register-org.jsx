import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
const Register = () => {
  const route = useRouter();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    confirmpassword: "",
    phone: "",
    organizationName: "",
  });
  //3usestates to handle logo/image upload
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [errors, setErrors] = useState({
    phoneErr: "",
    passwordErr: "",
    organizationNameErr: "",
  });
  const register = async (e) => {
    e.preventDefault();
    setErrors({
      phoneErr: "",
      passwordErr: "",
    });
    if (inputs.phone.length < 12) {
      setErrors({ ...errors, phoneErr: "Phone number length >=12" });
      return;
    }
    if (inputs.confirmpassword !== inputs.password) {
      setErrors({ ...errors, passwordErr: "passwords do not match" });
      return;
    }
    try {
      const res = await axios.post("/api/auth/register-org", inputs);
      const res2 = await axios.post("/api/auth/create-user", {
        organizationName: inputs.organizationName,
        email: inputs.email,
        password: inputs.password,
        isAdmin: 1,
      });
      if (res.data.err || res2.data.err) return;
      console.log(res2);
      route.push("/auth/login-user");
    } catch (err) {
      console.log(err);
    }
  };
  //spreads aka copy's all the prev values and changes only the newchange
  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };
  const handleUpload = async () => {
    setUploading(true);
    try {
      if (!selectedFile || inputs.organizationName === "") {
        setUploading(false);
        return;
      }
      const formData = new FormData();
      formData.append("myImage", selectedFile);
      const { data } = await axios.post(
        `/api/logo-upload?orgName=${inputs.organizationName}`,
        formData
      );
      console.log(data);
    } catch (error) {
      console.log(error.response);
      setUploading(false);
    }
  };
  return (
    <div className=" ">
      <div className="mx-auto flex-col justify-center items-center shadow-xl mt-16 p-4 text-grey-700 rounded-lg max-w-7xl">
        <h1 className="text-3xl text-orange-500 my-2 text-center">
          Register Your Organisation
        </h1>
        <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">
          Start Your journey in this
          <span className="text-pink-500 px-1">Family</span>
        </h2>

        <form>
          <div className=" mb-4">
            <label
              htmlFor="displayName"
              className="leading-7 text-sm text-gray-600"
            >
              Enter Name Of Your Organization
            </label>
            <input
              required
              type="text"
              name="organizationName"
              value={inputs.organizationName}
              onChange={(e) => handleChange(e)}
              className="w-full bg-white rounded border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className=" mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">
              Enter Email Of Root User
            </label>
            <input
              required
              type="email"
              name="email"
              value={inputs.email}
              onChange={(e) => handleChange(e)}
              className="w-full bg-white rounded border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className=" mb-4">
            <label
              htmlFor="password"
              className="leading-7 text-sm text-gray-600"
            >
              Enter Password For Root User
            </label>
            <input
              required
              type="password"
              name="password"
              value={inputs.password}
              onChange={(e) => handleChange(e)}
              className="w-full bg-white rounded border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className=" mb-4">
            <label
              htmlFor="password"
              className="leading-7 text-sm text-gray-600"
            >
              Confirm Password
            </label>
            <input
              required
              type="password"
              name="confirmpassword"
              value={inputs.confirmpassword}
              onChange={(e) => handleChange(e)}
              className="w-full bg-white rounded border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className=" mb-4">
            <label
              htmlFor="password"
              className="leading-7 text-sm text-gray-600"
            >
              Enter Phone With
              <span className="text-bold"> countycode no spaces</span>
            </label>
            <input
              required
              type="text"
              name="phone"
              value={inputs.phone}
              onChange={(e) => handleChange(e)}
              className="w-full bg-white rounded border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
            {/* logo */}
            <div className=" mb-4">
              <label>
                <input
                  type="file"
                  hidden
                  onChange={({ target }) => {
                    if (target.files) {
                      const file = target.files[0];
                      setSelectedImage(URL.createObjectURL(file));
                      setSelectedFile(file);
                    }
                  }}
                />
                <div className="w-40 aspect-video rounded flex items-center justify-center border-2 border-dashed cursor-pointer">
                  {selectedImage ? (
                    <img src={selectedImage} alt="" />
                  ) : (
                    <span>Select Image</span>
                  )}
                </div>
              </label>
              <button
                onClick={handleUpload}
                disabled={uploading}
                style={{ opacity: uploading ? ".5" : "1" }}
                className="bg-red-600 p-3 w-32 text-center rounded text-white"
              >
                {uploading ? "Uploaded" : "Upload"}
              </button>
            </div>
            <button
              onClick={(e) => register(e)}
              className="p-2 m-2 font-semibold text-pink-500 border border-orange-200 rounded-lg hover:bg-pink-400 hover:text-white"
            >
              Welcome To Family
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
