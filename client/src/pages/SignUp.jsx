import { useState } from "react";
import toast from "react-hot-toast";
import { FiCamera, FiUserPlus } from "react-icons/fi";
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
  const update = (e) =>
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  const image = (e) => {
    const avatar = e.target.files?.[0];
    if (avatar) {
      setSignupData({ ...signupData, avatar });
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(avatar);
    }
  };
  const submit = async (e) => {
    e.preventDefault();
    if (
      !signupData.fullName ||
      !signupData.email ||
      !signupData.password ||
      !signupData.avatar
    )
      return toast.error("Please fill in all details");
    if (signupData.fullName.length < 5)
      return toast.error("Name must be at least 5 characters");
    if (!isValidEmail(signupData.email))
      return toast.error("Enter a valid email");
    if (!isValidPassword(signupData.password))
      return toast.error(
        "Use a 6–16 character password with a number and special character",
      );
    const formData = new FormData();
    Object.entries(signupData).forEach(([k, v]) => formData.append(k, v));
    const res = await dispatch(createAccount(formData));
    if (res?.payload?.success) navigate("/");
  };
  return (
    <HomeLayout>
      <div className="page-wrap flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <form noValidate onSubmit={submit} className="form-card">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-xl text-blue-600">
            <FiUserPlus />
          </span>
          <h1 className="display-font mt-5 text-3xl font-bold">
            Start learning today
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Create your personal learning space in a minute.
          </p>
          <label className="group mx-auto mt-6 grid h-20 w-20 cursor-pointer place-items-center overflow-hidden rounded-full border-2 border-dashed border-blue-200 bg-blue-50 text-blue-500 hover:border-blue-500">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Avatar preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <FiCamera className="text-xl" />
            )}
            <input
              type="file"
              className="hidden"
              accept=".jpg,jpeg,.png,.svg"
              onChange={image}
            />
          </label>
          <p className="mt-2 text-center text-xs text-slate-500">
            Add a profile photo
          </p>
          <div className="mt-5 space-y-4">
            <label className="form-field">
              Full name
              <input
                name="fullName"
                required
                placeholder="Your name"
                value={signupData.fullName}
                onChange={update}
              />
            </label>
            <label className="form-field">
              Email
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                value={signupData.email}
                onChange={update}
              />
            </label>
            <label className="form-field">
              Password
              <input
                name="password"
                type="password"
                required
                placeholder="Create a password"
                value={signupData.password}
                onChange={update}
              />
            </label>
          </div>
          <button className="btn-primary mt-6 w-full">Create my account</button>
          <p className="mt-6 text-center text-sm text-slate-500">
            Already learning with us?{" "}
            <Link to="/login" className="font-bold text-blue-600">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  );
}
export default SignUp;
