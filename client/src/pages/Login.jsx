import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../layout/HomeLayout";
import { login } from "../store/slices/authSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      toast.error("Please fill all the field!");
      return;
    }

    // dispact login todo
    const res = await dispatch(login(loginData));
    if (res?.payload?.success) {
      navigate("/");
    }

    setLoginData({
      email: "",
      password: "",
    });
  };

  return (
    <HomeLayout>
      <div className="min-h-screen flex justify-center items-center">
        <form
          onSubmit={handleLogin}
          className="flex flex-col justify-center gap-3 p-4 rounded-lg text-white w-3/4 md:w-1/3 shadow-[0_0_10px_black]"
        >
          <h3 className="text-center font-bold text-2xl">Login</h3>
          <div className="gap-1">
            <label htmlFor="email" className="font-semibold">
              Email:
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              placeholder="Enter your email..."
              value={loginData.email}
              onChange={handleUserInput}
              className="w-full px-2 py-1 bg-transparent border"
            />
          </div>
          <div className="gap-1">
            <label htmlFor="password" className="font-semibold">
              Password:
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              placeholder="Enter your password..."
              value={loginData.password}
              onChange={handleUserInput}
              className="w-full px-2 py-1 bg-transparent border"
            />
          </div>
          {/* submit */}
          <button
            type="submit"
            className="bg-yellow-600 hover:bg-yellow-400 transition-all ease-out duration-300 rounded-sm py-2 mt-2 font-semibold text-lg cursor-pointer"
          >
            Login
          </button>
          <p className="text-center">
            Don&apos;t have an account?
            <Link to={"/signup"} className="link text-accent cursor-pointer">
              Signup
            </Link>
          </p>
          <p className="text-center">
            <Link
              to={"/ForgotPassword"}
              className="link text-accent cursor-pointer"
            >
              Forgot password?
            </Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  );
}

export default Login;
