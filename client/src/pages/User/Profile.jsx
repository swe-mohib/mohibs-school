import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../../layout/HomeLayout";
import { getUserData } from "../../store/slices/authSlice";
import { cancelSubscription } from "../../store/slices/razorpaySlice";

function User() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.auth);
  const { avatar, fullName, email, role, subscription } = data;

  useEffect(() => {
    dispatch(getUserData());
  }, []);

  const handleCancleSubscription = async (e) => {
    e.preventDefault();
    await dispatch(cancelSubscription());
    await dispatch(getUserData());
  };
  return (
    <HomeLayout>
      <div className="min-h-screen flex justify-center items-center">
        <div className="flex flex-col justify-center gap-3 p-12 rounded-lg text-white w-3/4  md:w-1/3 shadow-[0_0_10px_black]">
          <img
            src={avatar.secure_url}
            alt="profile_image"
            className="w-40 h-40 rounded-full m-auto border-2"
          />
          <h3 className="text-center text-2xl font-semibold capitalize">
            {fullName}
          </h3>
          <div className="grid grid-cols-2 gap-1">
            <p>Email</p>
            <p>: {email}</p>
            <p>Role</p>
            <p>: {role}</p>
            <p>Subscription</p>
            <p>
              :{" "}
              {subscription?.status === "active"
                ? subscription.status
                : "Not Subscribed"}
            </p>
            <p>Subscription Id</p>
            <p>
              :{" "}
              {subscription?.status === "active"
                ? subscription.id
                : "Not Subscribed"}
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2">
            <Link
              to={"/changepassword"}
              className="md:w-1/2 w-full text-center bg-yellow-600 hover:bg-yellow-400 transition-all ease-out duration-300 rounded-sm py-2 mt-2 font-semibold text-lg cursor-pointer"
            >
              Change Password
            </Link>
            <Link
              to={"/user/editprofile"}
              className="md:w-1/2 w-full text-center bg-yellow-600 hover:bg-yellow-400 transition-all ease-out duration-300 rounded-sm py-2 mt-2 font-semibold text-lg cursor-pointer"
            >
              Edit Profile
            </Link>
          </div>
          {subscription?.status === "active" ? (
            <button
              onClick={handleCancleSubscription}
              className="bg-red-600 hover:bg-red-400 transition-all ease-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
            >
              Cancel Subscription
            </button>
          ) : role !== "ADMIN" ? (
            <button
              onClick={() => navigate("/payment/checkout")}
              className="bg-red-600 hover:bg-red-400 transition-all ease-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
            >
              Buy Subscription
            </button>
          ) : (
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="bg-blue-600 hover:bg-blue-400 transition-all ease-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
            >
              Go to Admin Dashboard
            </button>
          )}
        </div>
      </div>
    </HomeLayout>
  );
}

export default User;
