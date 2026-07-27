import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import HomeLayout from "../../layout/HomeLayout";

function CheckoutSuccess() {
  const navigate = useNavigate();
  return (
    <HomeLayout>
      <div className="page-wrap flex min-h-[calc(100vh-10rem)] justify-center items-center">
        <div className="surface w-full max-w-md overflow-hidden text-center">
          <div className="bg-emerald-500 p-7 text-white">
            <h1 className="text-2xl font-bold">Payment successful</h1>
            <p className="mt-1 text-sm text-emerald-50">
              Your membership is active.
            </p>
          </div>
          <div className="flex h-72 flex-col gap-7 justify-center items-center text-center">
            {/* <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. In autem
              libero sint.
            </p> */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-900">
                Welcome to the pro bundle
              </h2>
              <p className="text-slate-500">You can now enjoy every course.</p>
            </div>
            <FaCheckCircle className="text-7xl text-green-600" />
          </div>
          <button
            onClick={() => navigate("/")}
            className="btn-primary m-6 mt-0 w-[calc(100%-3rem)]"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </HomeLayout>
  );
}

export default CheckoutSuccess;
