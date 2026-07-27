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
      <div className="page-wrap flex min-h-[calc(100vh-10rem)] justify-center items-center">
        <form
          onSubmit={handleFormSubmit}
          className="form-card flex flex-col justify-center gap-4"
        >
          <div className="mb-4 flex justify-between relative items-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="absolute left-0 p-3 cursor-pointer text-xl"
            >
              <FaArrowLeft />
            </button>
            <h1 className="display-font text-3xl font-semibold text-center m-auto relative">
              Forgot Password
            </h1>
          </div>

          <div className="form-field">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email.."
              className=""
              value={data.email}
              onChange={handleInputChange}
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            Submit
          </button>
        </form>
      </div>
    </HomeLayout>
  );
}

export default ForgotPassword;
