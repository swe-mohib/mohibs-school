import { useState } from "react";
import toast from "react-hot-toast";
import { FiArrowRight, FiLock } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../layout/HomeLayout";
import { login } from "../store/slices/authSlice";
function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "admin@gmail.com",
    password: "qW6*eZ1@",
  });
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password)
      return toast.error("Please fill all fields");
    const res = await dispatch(login(loginData));
    if (res?.payload?.success) navigate("/");
  };
  return (
    <HomeLayout>
      <div className="page-wrap flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <form onSubmit={handleLogin} className="form-card">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-xl text-blue-600">
            <FiLock />
          </span>
          <h1 className="display-font mt-5 text-3xl font-bold">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to continue your learning journey.
          </p>
          <div className="mt-7 space-y-4">
            <label className="form-field">
              Email
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
              />
            </label>
            <label className="form-field">
              Password
              <input
                type="password"
                required
                placeholder="Your password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
              />
            </label>
          </div>
          <div className="mt-3 text-right">
            <Link
              to="/forgotpassword"
              className="text-sm font-bold text-blue-600"
            >
              Forgot password?
            </Link>
          </div>
          <button className="btn-primary mt-6 flex w-full items-center justify-center gap-2">
            Sign in <FiArrowRight />
          </button>
          <p className="mt-6 text-center text-sm text-slate-500">
            New here?{" "}
            <Link to="/signup" className="font-bold text-blue-600">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  );
}
export default Login;
