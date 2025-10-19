import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import loading from "../assets/images/loading.gif";
import HomeLayout from "../layout/HomeLayout";
import { login } from "../store/slices/authSlice";

function LoginBypass() {
  const { loginBypass } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const hasAttempted = useRef(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = useCallback(async () => {
    if (hasAttempted.current) return; // ✅ Prevent duplicate runs
    hasAttempted.current = true;

    if (!loginData.email || !loginData.password) {
      toast.error("Something went wrong!");
      return;
    }

    try {
      const res = await dispatch(login(loginData));

      if (res?.payload?.success) {
        toast.success("Signed in as Admin");
        navigate("/");
      } else {
        throw new Error("Something went wrong!");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign-in failed.";
      toast.error(message);
      toast("Refresh to re-attempt.");
    } finally {
      setLoginData({ email: "", password: "" });
    }
  }, [dispatch, navigate, loginData]);

  useEffect(() => {
    const email = "admin@gmail.com";
    const password = loginBypass ? decodeURIComponent(loginBypass) : "";

    if (email && password) {
      setLoginData({ email, password });
    }
  }, [loginBypass]);

  // Run login once when loginData is ready
  useEffect(() => {
    if (loginData.email && loginData.password) {
      handleLogin();
    }
  }, [loginData, handleLogin]);

  const handleHome = () => navigate("/");

  return (
    <HomeLayout>
      <div className="flex flex-col items-center space-y-3 mt-10">
        <button
          onClick={handleHome}
          className="text-blue-600 hover:text-blue-800 visited:text-purple-600 underline cursor-pointer"
        >
          Home
        </button>
        <h2 className="text-yellow-600 font-medium text-lg">
          Signing you in as Admin…
        </h2>
        <img src={loading} alt="Loading..." className="w-28 h-auto" />
      </div>
    </HomeLayout>
  );
}

export default LoginBypass;
