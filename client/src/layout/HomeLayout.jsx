import { useRef } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { FiMenu } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import Footer from "../components/Footer";
import { logout } from "../store/slices/authSlice";

// eslint-disable-next-line react/prop-types
function HomeLayout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // check: is user loggedIn
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const role = useSelector((state) => state?.auth?.role);

  // logout function
  async function handleLogout(e) {
    e.preventDefault();

    const res = await dispatch(logout());
    if (res?.payload?.success) {
      localStorage.removeItem("isLoggedIn");
      navigate("/");
    }
  }

  const inputToggle = useRef(null);

  const closeSidebar = () => {
    inputToggle.current.checked = false;
  };
  return (
    <div className="min-h-[90vh]">
      <div className="drawer">
        <input
          id="my-drawer"
          type="checkbox"
          className="drawer-toggle"
          ref={inputToggle}
        />
        <div className="drawer-content">
          <label htmlFor="my-drawer" className="text-3xl cursor-pointer">
            <FiMenu className="m-4" />
          </label>
        </div>
        <div className="drawer-side z-50">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            <li className="flex flex-row">
              <Link
                to={"/"}
                className="flex flex-auto font-bold text-blue-600 text-2xl"
              >
                LMS
              </Link>
              <button onClick={closeSidebar} className="flex text-xl">
                <AiFillCloseCircle />
              </button>
            </li>
            <li>
              <Link to={"/"}>Home</Link>
            </li>
            {isLoggedIn && role === "ADMIN" && (
              <>
                <li>
                  <Link to="/admin/dashboard">Admin Dashboard</Link>
                </li>
                <li>
                  <Link to="/course/create">Create Course</Link>
                </li>
              </>
            )}
            <li>
              <Link to={"/courses"}>All Courses</Link>
            </li>
            <li>
              <Link to={"/contact"}>Contact Us</Link>
            </li>
            <li>
              <Link to={"/about"}>About Us</Link>
            </li>

            {!isLoggedIn && (
              <li className="absolute bottom-4 w-[90%] flex flex-row justify-center items-center space-x-2">
                <button className="bg-blue-500 font-semibold flex flex-auto justify-center items-center w-max">
                  <Link to={"/login"} className="w-full text-center">
                    LogIn
                  </Link>
                </button>
                <button className="bg-green-600 font-semibold flex flex-auto justify-center items-center">
                  <Link to={"/signup"} className="w-full text-center">
                    SignUp
                  </Link>
                </button>
              </li>
            )}
            {isLoggedIn && (
              <li className="absolute bottom-4 w-[90%] flex flex-row justify-center items-center space-x-2">
                <button className="bg-yellow-600 font-semibold flex flex-auto justify-center items-center">
                  <Link to="/user/profile">Profile</Link>
                </button>
                <button className="bg-red-600 font-semibold flex flex-auto justify-center items-center">
                  <Link onClick={handleLogout}>Logout</Link>
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="min-h-[80vh]">{children}</div>
      <Footer />
    </div>
  );
}

export default HomeLayout;
