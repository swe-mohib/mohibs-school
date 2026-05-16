import { useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import HomeLayout from "../../layout/HomeLayout";
import { forgotPassword } from "../../store/slices/authSlice";

function ForgotPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
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
    if (!data.email) {
      toast.error("All feild are required");
    }
    const res = await dispatch(forgotPassword(data));
    if (res?.payload?.success) {
      setData({
        email: "",
      });
    }
  };
  return (
    <HomeLayout>
      <div className="flex justify-center items-center min-h-screen">
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col justify-center gap-3 w-3/4 md:w-1/3 p-12 rounded-lg text-white shadow-[0_0_10px_black]"
        >
          <div className="mb-4 flex justify-between relative items-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="absolute left-0 p-3 cursor-pointer text-xl"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-3xl font-semibold text-center m-auto relative">
              Forgot Password
            </h1>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-semibold text-xl">
              Email:
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email.."
              className="bg-transparent border px-2 py-1"
              value={data.email}
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

export default ForgotPassword;
