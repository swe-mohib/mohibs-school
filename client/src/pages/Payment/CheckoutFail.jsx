import { RxCrossCircled } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

import HomeLayout from "../../layout/HomeLayout";

function CheckoutFail() {
  const navigate = useNavigate();
  return (
    <HomeLayout>
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white rounded-lg md:w-1/3 w-3/4 overflow-hidden shadow-[0_0_10px_black]">
          <h1 className="bg-red-600 text-center p-7 text-2xl font-bold">
            Payment Failed
          </h1>
          <div className="h-72 flex flex-col gap-9 justify-center items-center text-center">
            {/* <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. In autem
              libero sint.
            </p> */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">
                Oops ! Your payment failed
              </h2>
              <p>Please try again later</p>
            </div>
            <RxCrossCircled className="text-7xl text-red-600" />
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-center w-full p-2
            bg-yellow-600 hover:bg-yellow-400 transition-all ease-out duration-300 font-semibold text-xl cursor-pointer"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </HomeLayout>
  );
}

export default CheckoutFail;
