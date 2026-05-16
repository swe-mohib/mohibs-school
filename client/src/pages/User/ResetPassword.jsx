import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import HomeLayout from "../../layout/HomeLayout";
import { resetPassword } from "../../store/slices/authSlice";

function ResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { resetToken } = useParams();

  const [data, setData] = useState({
    password: "",
    resetToken: resetToken,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!data.password) {
      return toast.error("All feild are required");
    }
    const res = await dispatch(resetPassword([data.resetToken, data]));
    if (res?.payload?.success) {
      setData({
        password: "",
        resetToken: resetToken,
      });
      navigate("/login");
    }
  };
  return (
    <HomeLayout>
      <div className="flex justify-center items-center min-h-screen">
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col justify-center gap-3 w-3/4 md:w-1/3 p-12 rounded-lg text-white shadow-[0_0_10px_black]"
        >
          <h1 className="text-3xl font-semibold text-center m-auto relative">
            Reset Password
          </h1>

          <div className="flex flex-col gap-1">
            <label htmlFor="oldPassword" className="font-semibold text-xl">
              Create new password:
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter new password.."
              className="bg-transparent border px-2 py-1"
              value={data.password}
              onChange={handleInputChange}
            />
          </div>

          <button
            type="submit"
            className="w-full text-lg bg-yellow-600 py-2 font-semibold cursor-pointer rounded-sm hover:bg-yellow-400 transition-all ease-in-out duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </HomeLayout>
  );
}

export default ResetPassword;
