import { useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import HomeLayout from "../../layout/HomeLayout";
import { changePassword } from "../../store/slices/authSlice";

function ChangePassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setData] = useState({
    oldPassword: "",
    newPassword: "",
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
    if (!data.oldPassword || !data.newPassword) {
      return toast.error("All feilds are required");
    }
    const res = await dispatch(changePassword(data));
    if (res?.payload?.success) {
      setData({
        oldPassword: "",
        newPassword: "",
      });
      navigate(-1);
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
              Change Password
            </h1>
          </div>

          <div className="form-field">
            <label htmlFor="oldPassword">Old Password:</label>
            <input
              type="password"
              name="oldPassword"
              id="oldPassword"
              placeholder="Enter your old password.."
              className=""
              value={data.oldPassword}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              placeholder="Enter your old password.."
              className=""
              value={data.newPassword}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Change Password
          </button>
        </form>
      </div>
    </HomeLayout>
  );
}

export default ChangePassword;
