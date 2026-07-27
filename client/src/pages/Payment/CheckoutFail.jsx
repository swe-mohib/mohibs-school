import { RxCrossCircled } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

import HomeLayout from "../../layout/HomeLayout";

function CheckoutFail() {
  const navigate = useNavigate();
  return (
    <HomeLayout>
      <div className="page-wrap flex min-h-[calc(100vh-10rem)] justify-center items-center">
        <div className="surface w-full max-w-md overflow-hidden text-center">
          <div className="bg-rose-500 text-white p-7">
            <h1 className="text-2xl font-bold">Payment Failed</h1>
            <p className="mt-1 text-sm text-rose-50">
              No payment was completed.
            </p>
          </div>
          <div className="h-72 flex flex-col gap-7 justify-center items-center text-center">
            {/* <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. In autem
              libero sint.
            </p> */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-900">
                Oops ! Your payment failed
              </h2>
              <p className="text-slate-500">Please try again in a moment.</p>
            </div>
            <RxCrossCircled className="text-7xl text-red-600" />
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

export default CheckoutFail;
