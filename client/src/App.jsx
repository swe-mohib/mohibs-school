import "./App.css";

import { Route, Routes } from "react-router-dom";

import RequireAuth from "./components/Auth/RequireAuth";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import CourseDescription from "./pages/Course/CourseDescription";
import CourseList from "./pages/Course/CourseList";
import CreateCourse from "./pages/Course/CreateCourse";
import UpdateCourse from "./pages/Course/UpdateCourse";
import AddLecture from "./pages/Dashboard/AddLecture";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import DisplayLectures from "./pages/Dashboard/DisplayLectures";
import Denied from "./pages/Denied";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Checkout from "./pages/Payment/Checkout";
import CheckoutFail from "./pages/Payment/CheckoutFail";
import CheckoutSuccess from "./pages/Payment/CheckoutSuccess";
import SignUp from "./pages/SignUp";
import ChangePassword from "./pages/User/ChangePassword";
import EditProfile from "./pages/User/EditProfile";
import ForgotPassword from "./pages/User/ForgotPassword";
import User from "./pages/User/Profile";
import ResetPassword from "./pages/User/ResetPassword";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/course/description" element={<CourseDescription />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/denied" element={<Denied />} />

        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

        <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
          <Route path="/course/create" element={<CreateCourse />} />
          <Route path="/course/addlecture" element={<AddLecture />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/course/update" element={<UpdateCourse />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={["ADMIN", "USER"]} />}>
          <Route path="/user/profile" element={<User />} />
          <Route path="/user/editprofile" element={<EditProfile />} />
          <Route path="/payment/checkout" element={<Checkout />} />
          <Route
            path="/payment/checkout/success"
            element={<CheckoutSuccess />}
          />
          <Route path="/payment/checkout/fail" element={<CheckoutFail />} />
          <Route path="/course/displaylectures" element={<DisplayLectures />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
