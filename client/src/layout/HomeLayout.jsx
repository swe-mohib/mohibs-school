/* eslint-disable react/prop-types */
import {
  FiBookOpen,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiMoon,
  FiSun,
  FiUser,
  FiX,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";

import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";
import { logout } from "../store/slices/authSlice";

function HomeLayout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, role, data } = useSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();
  const closeMenu = () =>
    document.getElementById("site-menu")?.removeAttribute("open");
  const handleLogout = async () => {
    const res = await dispatch(logout());
    if (res?.payload?.success) navigate("/");
  };
  const navClass = ({ isActive }) =>
    `transition ${isActive ? "text-blue-600 font-bold" : "text-slate-600 hover:text-blue-600"}`;
  return (
    <div className="app-shell">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.75rem] w-[min(1180px,calc(100%-2rem))] items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-slate-900"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white">
              <FiBookOpen />
            </span>
            Learn<span className="text-blue-600">Sphere</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm md:flex">
            <NavLink className={navClass} to="/">
              Home
            </NavLink>
            <NavLink className={navClass} to="/courses">
              Courses
            </NavLink>
            <NavLink className={navClass} to="/about">
              About
            </NavLink>
            <NavLink className={navClass} to="/contact">
              Contact
            </NavLink>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="theme-toggle"
              aria-label="Toggle color theme"
            >
              {theme === "dark" ? <FiSun /> : <FiMoon />}
            </button>
            {isLoggedIn ? (
              <>
                <Link
                  to={role === "ADMIN" ? "/admin/dashboard" : "/user/profile"}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-600"
                >
                  <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-blue-100 text-blue-600">
                    {data?.avatar?.secure_url ? (
                      <img
                        src={data.avatar.secure_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FiUser />
                    )}
                  </span>
                  {data?.fullName?.split(" ")[0] || "Account"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-secondary !px-3 !py-2 text-sm"
                >
                  <FiLogOut />
                </button>
              </>
            ) : (
              <>
                <Link className="text-sm font-bold text-slate-700" to="/login">
                  Sign in
                </Link>
                <Link className="btn-primary !px-4 !py-2 text-sm" to="/signup">
                  Start learning
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label="Toggle color theme"
            >
              {theme === "dark" ? <FiSun /> : <FiMoon />}
            </button>
            <details id="site-menu" className="relative">
              <summary className="list-none rounded-lg p-2 text-xl text-slate-700">
                <FiMenu />
              </summary>
              <div className="absolute right-0 top-12 flex w-56 flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
                <button onClick={closeMenu} className="absolute right-2 top-2">
                  <FiX />
                </button>
                <NavLink onClick={closeMenu} className={navClass} to="/">
                  Home
                </NavLink>
                <NavLink onClick={closeMenu} className={navClass} to="/courses">
                  Courses
                </NavLink>
                <NavLink onClick={closeMenu} className={navClass} to="/about">
                  About
                </NavLink>
                <NavLink onClick={closeMenu} className={navClass} to="/contact">
                  Contact
                </NavLink>
                {isLoggedIn ? (
                  <>
                    <NavLink
                      onClick={closeMenu}
                      className={navClass}
                      to={
                        role === "ADMIN" ? "/admin/dashboard" : "/user/profile"
                      }
                    >
                      <FiGrid className="mr-2 inline" />
                      Dashboard
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="text-left font-semibold text-rose-600"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <Link
                    onClick={closeMenu}
                    className="btn-primary text-center"
                    to="/login"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </details>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <Footer />
    </div>
  );
}
export default HomeLayout;
