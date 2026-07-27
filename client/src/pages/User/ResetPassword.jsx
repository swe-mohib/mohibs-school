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
      <div className="page-wrap flex min-h-[calc(100vh-10rem)] justify-center items-center">
        <form
          onSubmit={handleFormSubmit}
          className="form-card flex flex-col justify-center gap-4"
        >
          <h1 className="display-font text-3xl font-semibold text-center m-auto relative">
            Reset Password
          </h1>

          <div className="form-field">
            <label htmlFor="oldPassword">Create new password:</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter new password.."
              className=""
              value={data.password}
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

export default ResetPassword;
