import { useState } from "react";
import toast from "react-hot-toast";
import { BsPersonCircle } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { isValidEmail, isValidPassword } from "../helpers/regexMatcher";
import HomeLayout from "../layout/HomeLayout";
import { createAccount } from "../store/slices/authSlice";
function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [previewImage, setPreviewImage] = useState("");
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    avatar: "",
  });

  const handleImageUpload = (e) => {
    e.preventDefault();

    // getting the image
    const uploadImage = e.target.files[0];

    if (uploadImage) {
      setSignupData({
        ...signupData,
        avatar: uploadImage,
      });
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadImage);
      fileReader.addEventListener("load", function () {
        setPreviewImage(this.result);
      });
    }
  };

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  };

  const createNewAccount = async (e) => {
    e.preventDefault();
    if (
      !signupData.fullName ||
      !signupData.email ||
      !signupData.password ||
      !signupData.avatar
    ) {
      toast.error("Please fill all the details");
      return;
    }

    if (signupData.fullName.length < 5) {
      toast.error("Name must be atleast 5 character");
      return;
    }

    if (!isValidEmail(signupData.email)) {
      toast.error("Invalid Email Id");
      return;
    }

    if (!isValidPassword(signupData.password)) {
      toast.error(
        "Password should be 6 - 16 character long with atleast a number and special character",
      );
      return;
    }

    const formData = new FormData();
    formData.append("fullName", signupData.fullName);
    formData.append("email", signupData.email);
    formData.append("password", signupData.password);
    formData.append("avatar", signupData.avatar);

    // dispatch create account action
    const res = await dispatch(createAccount(formData));
    if (res?.payload?.success) {
      navigate("/");
    }

    setSignupData({
      fullName: "",
      email: "",
      password: "",
      avatar: "",
    });
    setPreviewImage("");
  };
  return (
    <HomeLayout>
      <div className="min-h-screen flex justify-center items-center">
        <form
          noValidate
          onSubmit={createNewAccount}
          className="flex flex-col justify-center gap-3 p-4 rounded-lg text-white w-3/4 md:w-1/3 shadow-[0_0_10px_black]"
        >
          <h1 className="text-2xl text-center font-bold">Registration Page</h1>

          {/* avatar */}
          <label htmlFor="avatar" className="cursor-pointer">
            {previewImage ? (
              <img
                src={previewImage}
                className="w-24 h-24 rounded-full m-auto"
              />
            ) : (
              <BsPersonCircle className="w-24 h-24 rounded-full m-auto" />
            )}
          </label>
          <input
            type="file"
            className="hidden"
            name="avatar"
            id="avatar"
            accept=".jpg,jpeg,.png,.svg"
            onChange={handleImageUpload}
          />

          {/* fullName */}
          <div className="flex flex-col gap-1">
            <label htmlFor="fullName" className="font-semibold">
              Name:
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              required
              placeholder="Enter your name..."
              className="bg-transparent border px-2 py-1"
              onChange={handleUserInput}
              value={signupData.fullName}
            />
          </div>

          {/* email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-semibold">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Enter your email..."
              className="bg-transparent border px-2 py-1"
              onChange={handleUserInput}
              value={signupData.email}
            />
          </div>

          {/* password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-semibold">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="Enter your password..."
              className="bg-transparent border px-2 py-1"
              onChange={handleUserInput}
              value={signupData.password}
            />
          </div>

          {/* submit */}
          <button
            type="submit"
            className="bg-yellow-600 hover:bg-yellow-400 transition-all ease-out duration-300 rounded-sm py-2 mt-2 font-semibold text-lg cursor-pointer"
          >
            Create Account
          </button>
          <p className="text-center">
            Already have an account?
            <Link to={"/login"} className="link text-accent cursor-pointer">
              Login
            </Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  );
}

export default SignUp;
