import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCheck, FiCreditCard, FiLoader } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import HomeLayout from "../../layout/HomeLayout";
import { getUserData } from "../../store/slices/authSlice";
import {
  buySubscription,
  getRazorpayId,
  verifySubscription,
} from "../../store/slices/razorpaySlice";
function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { key, subscription_id } = useSelector((s) => s.razorpay);
  const subscribe = async (e) => {
    e.preventDefault();
    if (!key || !subscription_id)
      return toast.error("Payment details aren't ready. Try again.");
    const paymentObject = new window.Razorpay({
      key,
      subscription_id,
      name: "LearnSphere",
      description: "All-access learning membership",
      theme: { color: "#1677ff" },
      handler: async (r) => {
        const res = await dispatch(
          verifySubscription({
            razorpay_payment_id: r.razorpay_payment_id,
            razorpay_signature: r.razorpay_signature,
            razorpay_subscription_id: r.razorpay_subscription_id,
          }),
        );
        await dispatch(getUserData());
        navigate(
          res?.payload?.success
            ? "/payment/checkout/success"
            : "/payment/checkout/fail",
        );
      },
    });
    paymentObject.open();
  };
  useEffect(() => {
    (async () => {
      await dispatch(getRazorpayId());
      await dispatch(buySubscription());
      setIsLoading(false);
    })();
  }, [dispatch]);
  return (
    <HomeLayout>
      <div className="page-wrap flex min-h-[calc(100vh-10rem)] items-center justify-center">
        {isLoading ? (
          <div className="flex items-center gap-3 text-slate-500">
            <FiLoader className="animate-spin text-blue-600" /> Preparing secure
            checkout…
          </div>
        ) : (
          <form
            onSubmit={subscribe}
            className="surface w-full max-w-md overflow-hidden"
          >
            <div className="bg-slate-900 p-8 text-white">
              <span className="text-xs font-bold uppercase tracking-[.15em] text-blue-300">
                All-access plan
              </span>
              <h1 className="display-font mt-3 text-4xl font-bold">
                Learn anything.
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                One simple membership for your next year of growth.
              </p>
              <div className="mt-7 flex items-end gap-1">
                <span className="text-5xl font-bold">₹499</span>
                <span className="mb-1 text-slate-300">/ year</span>
              </div>
            </div>
            <div className="p-7">
              <ul className="space-y-4 text-sm text-slate-600">
                {[
                  "Access every current course",
                  "New courses added during your membership",
                  "Learn from any device",
                  "Cancel anytime",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <FiCheck className="mt-0.5 shrink-0 text-lg text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="btn-primary mt-8 flex w-full items-center justify-center gap-2">
                <FiCreditCard /> Continue to payment
              </button>
              <p className="mt-4 text-center text-xs text-slate-400">
                Secure payment powered by Razorpay
              </p>
            </div>
          </form>
        )}
      </div>
    </HomeLayout>
  );
}
export default Checkout;
