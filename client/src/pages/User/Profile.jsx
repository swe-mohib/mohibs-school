import { useEffect } from "react";
import { FiCreditCard, FiEdit3, FiKey, FiShield } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../../layout/HomeLayout";
import { getUserData } from "../../store/slices/authSlice";
import { cancelSubscription } from "../../store/slices/razorpaySlice";
function User() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data } = useSelector((s) => s.auth);
  const { avatar, fullName, email, role, subscription } = data;
  useEffect(() => {
    dispatch(getUserData());
  }, [dispatch]);
  const cancel = async () => {
    await dispatch(cancelSubscription());
    await dispatch(getUserData());
  };
  const active = subscription?.status === "active";
  return (
    <HomeLayout>
      <div className="page-wrap">
        <span className="eyebrow">Your account</span>
        <div className="mt-5 grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
          <aside className="surface p-7 text-center">
            <img
              src={avatar?.secure_url}
              alt="Profile"
              className="mx-auto h-28 w-28 rounded-full border-4 border-blue-50 object-cover"
            />
            <h1 className="display-font mt-4 text-3xl font-bold capitalize">
              {fullName}
            </h1>
            <p className="mt-1 text-sm text-slate-500">{email}</p>
            <span className="mt-5 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
              {role}
            </span>
            <div className="mt-7 grid gap-2">
              <Link
                to="/user/editprofile"
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <FiEdit3 /> Edit profile
              </Link>
              <Link
                to="/changepassword"
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <FiKey /> Change password
              </Link>
            </div>
          </aside>
          <section className="surface p-7">
            <h2 className="text-xl font-bold">Learning access</h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage your course subscription and access.
            </p>
            <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-100 text-blue-600">
                    <FiCreditCard />
                  </span>
                  <div>
                    <p className="font-bold">All-access membership</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {active
                        ? "Active — all courses unlocked"
                        : "Not currently active"}
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}
                >
                  {active ? "Active" : "Inactive"}
                </span>
              </div>
              {subscription?.id && (
                <p className="mt-4 text-xs text-slate-400">
                  Subscription ID: {subscription.id}
                </p>
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {active ? (
                <button
                  onClick={cancel}
                  className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600"
                >
                  Cancel membership
                </button>
              ) : role !== "ADMIN" ? (
                <button
                  onClick={() => navigate("/payment/checkout")}
                  className="btn-primary"
                >
                  Unlock all courses
                </button>
              ) : (
                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="btn-primary flex items-center gap-2"
                >
                  <FiShield /> Open admin dashboard
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </HomeLayout>
  );
}
export default User;
